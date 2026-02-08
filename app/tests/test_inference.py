import pytest
from fastapi.testclient import TestClient
from app.main import app
from pathlib import Path
from PIL import Image

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"

def test_predict_file(tmp_path):
    sample = tmp_path / "sample.jpg"
    # create tiny RGB image
    Image.new("RGB", (100, 200), color=(128, 200, 128)).save(sample)
    with open(sample, "rb") as f:
        r = client.post("/api/v1/biomass/predict", files={"file": ("sample.jpg", f, "image/jpeg")})
    # This might fail if models are not loaded/found, but we check if the endpoint exists
    # If the model is not found, it might still return a 200 with random init results
    # depending on how BiomassPredictor handles missing models.
    assert r.status_code == 200
    data = r.json()
    assert "predictions" in data
    assert "metrics" in data
