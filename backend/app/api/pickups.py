from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.entities import PickupRequest, CollectionStatusEnum, User
from app.schemas.all_schemas import PickupRequestCreate, PickupRequestResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/pickups", tags=["Pickup Requests"])

@router.get("", response_model=List[PickupRequestResponse])
def get_pickups(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value == "CITIZEN":
        return db.query(PickupRequest).filter(PickupRequest.user_id == current_user.id).order_by(PickupRequest.id.desc()).all()
    return db.query(PickupRequest).order_by(PickupRequest.id.desc()).all()

@router.post("", response_model=PickupRequestResponse)
def create_pickup(data: PickupRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = db.query(PickupRequest).count() + 1
    req_code = f"PICK-2026-{count:04d}"

    pickup = PickupRequest(
        request_code=req_code,
        user_id=current_user.id,
        waste_category=data.waste_category,
        estimated_weight_kg=data.estimated_weight_kg,
        pickup_address=data.pickup_address,
        latitude=data.latitude or 28.6139,
        longitude=data.longitude or 77.2090,
        contact_phone=data.contact_phone,
        preferred_time_slot=data.preferred_time_slot,
        status=CollectionStatusEnum.PENDING
    )
    db.add(pickup)
    db.commit()
    db.refresh(pickup)
    return pickup

@router.patch("/{pickup_id}/status")
def update_pickup_status(pickup_id: int, status: CollectionStatusEnum, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(PickupRequest).filter(PickupRequest.id == pickup_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Pickup request not found")
    p.status = status
    if current_user.role.value == "COLLECTOR":
        p.assigned_collector_id = current_user.id
    db.commit()
    return {"status": "SUCCESS", "request_code": p.request_code, "new_status": p.status.value}
