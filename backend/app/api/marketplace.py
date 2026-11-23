from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.entities import MarketplaceListing, MarketplaceOrder, User
from app.schemas.all_schemas import (
    MarketplaceListingCreate, MarketplaceListingResponse,
    MarketplaceOrderCreate, MarketplaceOrderResponse
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/marketplace", tags=["Recycling Marketplace"])

@router.get("/listings", response_model=List[MarketplaceListingResponse])
def get_listings(material_type: str = None, db: Session = Depends(get_db)):
    query = db.query(MarketplaceListing).filter(MarketplaceListing.is_active == True)
    if material_type:
        query = query.filter(MarketplaceListing.material_type == material_type)
    return query.order_by(MarketplaceListing.id.desc()).all()

@router.post("/listings", response_model=MarketplaceListingResponse)
def create_listing(data: MarketplaceListingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    listing = MarketplaceListing(
        seller_id=current_user.id,
        title=data.title,
        material_type=data.material_type,
        quantity_available_kg=data.quantity_available_kg,
        price_per_kg=data.price_per_kg,
        quality_grade=data.quality_grade,
        location=data.location,
        description=data.description
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

@router.post("/orders", response_model=MarketplaceOrderResponse)
def place_order(data: MarketplaceOrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == data.listing_id).first()
    if not listing or not listing.is_active:
        raise HTTPException(status_code=404, detail="Material listing unavailable")
    if data.quantity_kg > listing.quantity_available_kg:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    order_code = f"ORD-2026-{db.query(MarketplaceOrder).count() + 1:05d}"
    total = round(data.quantity_kg * listing.price_per_kg, 2)

    order = MarketplaceOrder(
        order_code=order_code,
        listing_id=listing.id,
        buyer_id=current_user.id,
        quantity_kg=data.quantity_kg,
        total_amount=total,
        status="APPROVED",
        shipping_address=data.shipping_address
    )
    # Deduct stock
    listing.quantity_available_kg -= data.quantity_kg
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
