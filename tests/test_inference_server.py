"""Tests for Image2Biomass inference server."""
import sys
from pathlib import Path

# Add inference_server to path so app can be imported
_inference_server = Path(__file__).parent.parent / "inference_server"
sys.path.insert(0, str(_inference_server))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "model_loaded" in data


def test_predict_json_schema():
    r = client.post(
        "/api/v1/predict",
        json={
            "pasture_id": "demo",
            "tile_z": 14,
            "tile_x": 8500,
            "tile_y": 5500,
            "sources": ["satellite"],
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert "pastureId" in data
    assert "biomass_mean_t_ha" in data
    assert "biomass_std_t_ha" in data
    assert "tile" in data
