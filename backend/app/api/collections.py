from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.entities import Bin, Collection, CollectionStatusEnum, User
from app.services.route_optimizer import route_optimizer
from app.api.auth import get_current_user

router = APIRouter(prefix="/collections", tags=["Collections & Route Optimization"])

@router.get("/optimized-route")
def get_optimized_route(
    start_lat: float = 28.6139,
    start_lon: float = 77.2090,
    db: Session = Depends(get_db)
):
    """
    Computes real distance-optimized collection route for bins that require collection (>70% fill)
    """
    priority_bins = db.query(Bin).filter(Bin.current_fill_percent >= 60.0).all()
    if not priority_bins:
        # Fallback to top bins
        priority_bins = db.query(Bin).order_by(Bin.current_fill_percent.desc()).limit(6).all()

    stops = [
        {
            "id": b.id,
            "bin_code": b.bin_code,
            "name": b.name,
            "latitude": b.latitude,
            "longitude": b.longitude,
            "current_fill_percent": b.current_fill_percent,
            "current_weight_kg": b.current_weight_kg,
            "address": b.address or b.area
        }
        for b in priority_bins
    ]

    route_plan = route_optimizer.optimize_route(start_lat, start_lon, stops)
    return route_plan
