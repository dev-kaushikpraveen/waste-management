from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.entities import WasteBatch, BatchEvent, BatchStatusEnum, User, UserRoleEnum
from app.schemas.all_schemas import WasteBatchCreate, WasteBatchResponse, BatchStatusUpdate, BatchEventResponse
from app.services.qr_service import qr_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/batches", tags=["Digital Plastic Passport"])

@router.get("", response_model=List[WasteBatchResponse])
def get_all_batches(
    status: Optional[BatchStatusEnum] = None,
    plastic_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WasteBatch)
    if status:
        query = query.filter(WasteBatch.status == status)
    if plastic_type:
        query = query.filter(WasteBatch.plastic_type == plastic_type)
    return query.order_by(WasteBatch.id.desc()).all()

@router.post("", response_model=WasteBatchResponse)
def create_batch(
    data: WasteBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Generate unique Digital Plastic Passport Code: ECO-{TYPE}-2026-XXXXXX
    count = db.query(WasteBatch).count() + 1
    clean_type = data.plastic_type.upper().replace(" ", "")[:4]
    batch_code = f"ECO-{clean_type}-2026-{count:06d}"

    # Generate QR Code pointing to public tracking
    tracking_url = f"https://ecotrace360.org/track/{batch_code}"
    qr_data_uri = qr_service.generate_qr_data_uri(tracking_url)

    new_batch = WasteBatch(
        batch_code=batch_code,
        plastic_type=data.plastic_type,
        source_location=data.source_location,
        source_type=data.source_type,
        initial_weight_kg=data.initial_weight_kg,
        status=BatchStatusEnum.CREATED,
        collector_id=current_user.id if current_user.role == UserRoleEnum.COLLECTOR else None,
        qr_code_url=qr_data_uri
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    # Add initial CREATED event to immutable audit ledger
    first_event = BatchEvent(
        batch_id=new_batch.id,
        status=BatchStatusEnum.CREATED,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        location=data.source_location,
        notes=f"Digital Plastic Passport initiated. Initial certified weight: {data.initial_weight_kg} kg.",
        recorded_weight_kg=data.initial_weight_kg
    )
    db.add(first_event)
    db.commit()
    db.refresh(new_batch)
    return new_batch

@router.get("/track/{batch_code}")
def track_batch_public(batch_code: str, db: Session = Depends(get_db)):
    """
    Public QR Tracking Endpoint:
    Exposes transparent, tamper-proof plastic lifecycle timeline.
    """
    batch = db.query(WasteBatch).filter(WasteBatch.batch_code == batch_code).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Digital Plastic Passport not found")

    events = db.query(BatchEvent).filter(BatchEvent.batch_id == batch.id).order_by(BatchEvent.timestamp.asc()).all()

    return {
        "batch_code": batch.batch_code,
        "plastic_type": batch.plastic_type,
        "source_location": batch.source_location,
        "initial_weight_kg": batch.initial_weight_kg,
        "processed_weight_kg": batch.processed_weight_kg,
        "current_status": batch.status.value,
        "created_at": batch.created_at,
        "qr_code_url": batch.qr_code_url,
        "timeline": [
            {
                "status": e.status.value,
                "actor_role": e.actor_role or "System Verified",
                "location": e.location,
                "notes": e.notes,
                "recorded_weight_kg": e.recorded_weight_kg,
                "timestamp": e.timestamp.isoformat()
            }
            for e in events
        ]
    }

@router.patch("/{batch_id}/status", response_model=WasteBatchResponse)
def update_batch_status(
    batch_id: int,
    update: BatchStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    batch = db.query(WasteBatch).filter(WasteBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    batch.status = update.status
    if update.recorded_weight_kg:
        if update.status in [BatchStatusEnum.RECEIVED, BatchStatusEnum.SORTED]:
            batch.received_weight_kg = update.recorded_weight_kg
        elif update.status in [BatchStatusEnum.PROCESSED, BatchStatusEnum.RECYCLED]:
            batch.processed_weight_kg = update.recorded_weight_kg

    if current_user.role == UserRoleEnum.RECYCLER:
        batch.recycler_id = current_user.id
    elif current_user.role == UserRoleEnum.COLLECTOR:
        batch.collector_id = current_user.id

    # Append-only immutable event creation
    event = BatchEvent(
        batch_id=batch.id,
        status=update.status,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        location=update.location or batch.source_location,
        notes=update.notes or f"Status updated to {update.status.value}",
        recorded_weight_kg=update.recorded_weight_kg or batch.initial_weight_kg,
        evidence_image_url=update.evidence_image_url
    )
    db.add(event)
    db.commit()
    db.refresh(batch)
    return batch
