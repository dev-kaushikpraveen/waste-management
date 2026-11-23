import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "EcoTrace 360"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_success():
    response = client.post("/api/auth/login", json={
        "email": "citizen@ecotrace.org",
        "password": "EcoCitizen2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "CITIZEN"

def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "email": "citizen@ecotrace.org",
        "password": "WrongPassword123"
    })
    assert response.status_code == 401

def test_get_bins():
    response = client.get("/api/bins")
    assert response.status_code == 200
    bins = response.json()
    assert len(bins) >= 5
    assert any(b["bin_code"] == "BIN-DEL-01" for b in bins)

def test_ai_classification():
    response = client.post("/api/ai/classify-waste", json={})
    assert response.status_code == 200
    data = response.json()
    assert "predicted_category" in data
    assert data["confidence"] > 0.8
    assert len(data["bounding_boxes"]) > 0

def test_ai_waste_forecast():
    response = client.get("/api/ai/forecast-waste?area=Hostel%20Zone&days=3")
    assert response.status_code == 200
    forecasts = response.json()
    assert len(forecasts) == 3
    assert forecasts[0]["predicted_waste_kg"] > 0

def test_digital_plastic_passport_tracking():
    response = client.get("/api/batches/track/ECO-PET-2026-000001")
    assert response.status_code == 200
    passport = response.json()
    assert passport["batch_code"] == "ECO-PET-2026-000001"
    assert len(passport["timeline"]) >= 7

def test_environmental_impact():
    response = client.get("/api/analytics/environmental-impact")
    assert response.status_code == 200
    impact = response.json()
    assert impact["total_waste_collected_kg"] > 0
    assert impact["co2_saved_kg"] > 0
    assert impact["active_smart_bins"] >= 3

def test_route_optimization():
    response = client.get("/api/collections/optimized-route")
    assert response.status_code == 200
    route = response.json()
    assert "ordered_stops" in route
    assert route["total_distance_km"] >= 0
