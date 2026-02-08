from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_trigger_inference():
    pasture_id = "P3"
    r = client.post(f"/api/v1/pastures/{pasture_id}/predict", json={
        "sources": ["satellite", "drone"],
        "force": False
    })
    assert r.status_code == 200
    data = r.json()
    assert "jobId" in data
    assert data["status"] == "accepted"

def test_get_tile_json():
    pasture_id = "P3"
    z, x, y = 14, 8256, 5632
    r = client.get(f"/api/v1/pastures/{pasture_id}/tiles/{z}/{x}/{y}.json")
    assert r.status_code == 200
    data = r.json()
    assert data["pasture_id"] == pasture_id
    assert data["tile_z"] == z
    assert "biomass_mean" in data

def test_simulate_scenario():
    pasture_id = "P3"
    r = client.post(f"/api/v1/pastures/{pasture_id}/simulate", json={
        "scenario": {
            "startInDays": 7,
            "durationDays": 5,
            "stockingRate": 1.1
        }
    })
    assert r.status_code == 200
    data = r.json()
    assert "recoveryDays" in data
    assert "postBiomass" in data
    assert "soilImpact" in data

def test_create_audit_log():
    log_id = str(uuid.uuid4())
    r = client.post("/api/v1/pastures/audit", json={
        "id": log_id,
        "user_id": "user123",
        "action": "view_prediction",
        "model_version": "v1.0",
        "confidence": 0.95,
        "pasture_id": "P3",
        "details": {"viewed": "full_report"}
    })
    assert r.status_code == 200
    assert r.json()["id"] == log_id

def test_get_prediction_summary():
    pasture_id = "P3"
    r = client.get(f"/api/v1/pastures/{pasture_id}/prediction_summary")
    assert r.status_code == 200
    data = r.json()
    assert data["pastureId"] == pasture_id
    assert "forecast" in data
    assert "recommendation" in data
    assert "explainability" in data
