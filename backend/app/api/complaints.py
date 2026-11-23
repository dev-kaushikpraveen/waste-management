from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.entities import Complaint, ComplaintStatusEnum, User
from app.schemas.all_schemas import ComplaintCreate, ComplaintResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/complaints", tags=["Complaints & Illegal Dumping"])

@router.get("", response_model=List[ComplaintResponse])
def get_complaints(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.value == "CITIZEN":
        return db.query(Complaint).filter(Complaint.user_id == current_user.id).order_by(Complaint.id.desc()).all()
    return db.query(Complaint).order_by(Complaint.id.desc()).all()

@router.post("", response_model=ComplaintResponse)
def submit_complaint(data: ComplaintCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    code = f"CMP-2026-{db.query(Complaint).count() + 1:04d}"
    complaint = Complaint(
        complaint_code=code,
        user_id=current_user.id,
        category=data.category,
        description=data.description,
        address=data.address or "Campus Boundary Sector",
        latitude=data.latitude or 28.6139,
        longitude=data.longitude or 77.2090,
        image_url=data.image_url,
        status=ComplaintStatusEnum.SUBMITTED
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.patch("/{complaint_id}/resolve")
def resolve_complaint(
    complaint_id: int,
    resolution_notes: str = "Cleaned by sanitation team and verified.",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    c = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    c.status = ComplaintStatusEnum.RESOLVED
    c.resolution_notes = resolution_notes
    c.resolved_at = datetime.utcnow()
    db.commit()
    return {"status": "SUCCESS", "complaint_code": c.complaint_code, "new_status": "RESOLVED"}
