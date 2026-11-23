from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.entities import Bin, BinReading
from app.schemas.all_schemas import BinCreate, BinResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/bins", tags=["Smart Bins"])

@router.get("", response_model=List[BinResponse])
def get_all_bins(db: Session = Depends(get_db)):
    return db.query(Bin).all()

@router.post("", response_model=BinResponse)
def create_bin(bin_data: BinCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    existing = db.query(Bin).filter(Bin.bin_code == bin_data.bin_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bin code already exists")
    new_bin = Bin(**bin_data.dict())
    db.add(new_bin)
    db.commit()
    db.refresh(new_bin)
    return new_bin

@router.get("/{bin_id}", response_model=BinResponse)
def get_bin(bin_id: int, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    return b
