from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.entities import Bin, BinReading, Notification
from app.schemas.all_schemas import IoTTelemetryPayload
from app.core.websocket import ws_manager
import random

router = APIRouter(prefix="/iot", tags=["IoT Telemetry"])

@router.post("/telemetry")
async def ingest_telemetry(payload: IoTTelemetryPayload, db: Session = Depends(get_db)):
    """
    Ingests sensor payload from ESP32 hardware or simulator.
    MQTT topic: ecotrace/bins/{bin_id}/telemetry
    """
    bin_obj = db.query(Bin).filter(Bin.bin_code == payload.bin_code).first()
    if not bin_obj:
        raise HTTPException(status_code=404, detail=f"Bin {payload.bin_code} not registered")

    # Height of standard 120L bin is 100cm.
    # distance_cm: 100cm = 0% fill; 10cm = 90% fill.
    fill_percent = max(0.0, min(100.0, round((100.0 - payload.distance_cm), 1)))

    # Update bin state
    bin_obj.current_fill_percent = fill_percent
    bin_obj.current_weight_kg = payload.weight_kg
    bin_obj.last_reported_at = datetime.utcnow()
    
    if fill_percent >= 90.0:
        bin_obj.status = "OVERFLOW"
    elif fill_percent >= 75.0:
        bin_obj.status = "COLLECTION_NEEDED"
    else:
        bin_obj.status = "ACTIVE"

    reading = BinReading(
        bin_id=bin_obj.id,
        distance_cm=payload.distance_cm,
        fill_percent=fill_percent,
        weight_kg=payload.weight_kg,
        battery_level=payload.battery_level,
        temperature_c=payload.temperature_c,
        is_simulated=payload.is_simulated
    )
    db.add(reading)
    db.commit()

    # Broadcast update to connected frontend via WebSockets
    telemetry_event = {
        "type": "BIN_TELEMETRY",
        "bin_id": bin_obj.id,
        "bin_code": bin_obj.bin_code,
        "fill_percent": fill_percent,
        "weight_kg": payload.weight_kg,
        "status": bin_obj.status,
        "is_simulated": payload.is_simulated,
        "timestamp": datetime.utcnow().isoformat()
    }
    await ws_manager.broadcast(telemetry_event)

    return {"status": "SUCCESS", "fill_percent": fill_percent, "bin_status": bin_obj.status}

@router.post("/simulate-step")
async def simulate_iot_step(db: Session = Depends(get_db)):
    """
    Triggers a realistic simulated IoT reading step across all active bins
    """
    bins = db.query(Bin).all()
    results = []
    for b in bins:
        # Increase fill by 3-10% to simulate waste drop, or reset if emptied
        new_fill = b.current_fill_percent + random.uniform(2.5, 8.0)
        if new_fill > 100:
            new_fill = random.uniform(15.0, 30.0) # emptied
        
        distance_cm = max(5.0, 100.0 - new_fill)
        new_weight = round((new_fill / 100.0) * b.max_weight_kg, 1)

        payload = IoTTelemetryPayload(
            device_uid=f"SIM-{b.bin_code}",
            bin_code=b.bin_code,
            distance_cm=round(distance_cm, 1),
            weight_kg=new_weight,
            battery_level=round(random.uniform(85.0, 98.0), 1),
            temperature_c=round(random.uniform(24.0, 29.0), 1),
            is_simulated=True
        )
        await ingest_telemetry(payload, db)
        results.append({"bin_code": b.bin_code, "fill": round(new_fill, 1), "weight": new_weight})

    return {"status": "SUCCESS", "simulated_bins_updated": len(results), "readings": results}
