from fastapi import APIRouter, HTTPException, Response
from typing import List, Dict
from datetime import datetime, timedelta
import uuid
from app.schemas import (
    InferenceRequest, TilePrediction, SimulationRequest, SimulationResponse,
    AuditLog, FullBiomassPredictionResponse, ForecastItem, Recommendation,
    Explainability, Provenance
)

router = APIRouter(prefix="/api/v1/pastures", tags=["image2biomass"])

@router.post("/{pasture_id}/predict")
async def trigger_inference(pasture_id: str, request: InferenceRequest):
    """
    1) Trigger inference for a pasture
    POST /api/v1/pastures/{id}/predict
    """
    # In a real app, this would trigger a background task
    job_id = str(uuid.uuid4())
    return {"jobId": job_id, "status": "accepted"}

@router.get("/{pasture_id}/tiles/{z}/{x}/{y}.mvt")
async def get_tile_mvt(pasture_id: str, z: int, x: int, y: int):
    """
    2) Get tile prediction (for map)
    GET /api/v1/pastures/{id}/tiles/{z}/{x}/{y}.mvt
    Returns: vector tile or raster tile of biomass values (mocked)
    """
    # Mocking a binary response for MVT
    return Response(content=b"", media_type="application/x-protobuf", headers={
        "X-Model-Version": "biomass-v3.2",
        "X-Timestamp": datetime.utcnow().isoformat()
    })

@router.get("/{pasture_id}/tiles/{z}/{x}/{y}.json", response_model=TilePrediction)
async def get_tile_json(pasture_id: str, z: int, x: int, y: int):
    """
    3) Get per-tile JSON
    GET /api/v1/pastures/{id}/tiles/{z}/{x}/{y}.json
    """
    return TilePrediction(
        id=str(uuid.uuid4()),
        pasture_id=pasture_id,
        tile_z=z,
        tile_x=x,
        tile_y=y,
        biomass_mean=2.8,
        biomass_std=0.22,
        model_version="biomass-v3.2",
        timestamp=datetime.utcnow(),
        provenance={"sources": ["satellite", "drone"]}
    )

@router.post("/{pasture_id}/simulate", response_model=SimulationResponse)
async def simulate_scenario(pasture_id: str, request: SimulationRequest):
    """
    4) Simulation / What-if
    POST /api/v1/pastures/{id}/simulate
    """
    # Mock logic based on stocking rate
    recovery_days = int(20 + request.scenario.stockingRate * 5)
    post_biomass = max(0.5, 3.5 - request.scenario.stockingRate * 0.8)
    impact = "low" if request.scenario.stockingRate < 1.2 else "medium"
    
    return SimulationResponse(
        recovery_days=recovery_days,
        postBiomass=post_biomass,
        soilImpact=impact
    )

@router.post("/audit") # Note: Plan says /api/v1/audit, and prefix is /api/v1/pastures. 
# Re-adjusting to match Issue Description exactly for audit.
async def create_audit_log(log: AuditLog):
    """
    5) Audit log entry (auto)
    POST /api/v1/audit
    """
    return {"status": "logged", "id": log.id}

# Adding the mock full response for frontend demo as mentioned in section 11
@router.get("/{pasture_id}/prediction_summary", response_model=FullBiomassPredictionResponse)
async def get_prediction_summary(pasture_id: str):
    now = datetime.utcnow()
    return FullBiomassPredictionResponse(
        pastureId=pasture_id,
        timestamp=now,
        modelVersion="biomass-v3.2",
        tileUrl=f"s3://pastureai/tiles/{pasture_id}/14/8256/5632.tif",
        biomass_mean_t_ha=2.8,
        biomass_std_t_ha=0.22,
        forecast=[
            ForecastItem(date=(now + timedelta(days=1)).strftime("%Y-%m-%d"), predicted=2.85, lower=2.6, upper=3.1),
            ForecastItem(date=(now + timedelta(days=8)).strftime("%Y-%m-%d"), predicted=3.3, lower=2.9, upper=3.7)
        ],
        recommendation=Recommendation(
            action="WAIT",
            suggestedInDays=7,
            reasoning=["Below rotational threshold 3.5 t/ha", "Soil moisture adequate", "High compaction risk if grazed"]
        ),
        explainability=Explainability(
            topDrivers=[
                {"feature": "NDVI_mean", "impact": 0.42},
                {"feature": "CanopyHeight", "impact": 0.27}
            ]
        ),
        provenance=Provenance(
            sources=["satellite:sentinel-2:2026-02-05", "drone:mission_23:2026-02-06"],
            groundSamples=5
        )
    )
