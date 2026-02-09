# app/sustainability/api.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.sustainability import models as s_models
from app.sustainability import utils as s_utils
from app.sustainability import planner as s_planner
from app.sustainability import decision_logic as s_logic


router = APIRouter(prefix="/api/v1/sustainability", tags=["sustainability"])


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class RecordIn(BaseModel):
    paddock_id: Optional[int]
    source: Optional[str] = "mobile"
    area_m2: float
    ndvi_mean: Optional[float] = None
    coverage_pct: Optional[float] = None
    dry_biomass_g_m2: Optional[float] = None
    notes: Optional[str] = None
    meta: Optional[dict] = {}


@router.post("/record", response_model=dict)
def create_record(payload: RecordIn, db: Session = Depends(get_db)):
    # derive biomass if not provided — for demo, use ndvi->biomass heuristic
    biomass = payload.dry_biomass_g_m2
    if biomass is None:
        if payload.ndvi_mean is not None:
            # simple heuristic: biomass_g_m2 = a * ndvi + b
            biomass = max(0.0, (payload.ndvi_mean - 0.05) * 600.0)  # heuristic
        else:
            raise HTTPException(status_code=400, detail="Provide ndvi_mean or dry_biomass_g_m2")
    carbon_kg = s_utils.biomass_g_m2_to_carbon_kg(biomass, payload.area_m2)
    co2e = s_utils.carbon_kg_to_co2e_kg(carbon_kg)
    biodiversity = None
    if payload.meta and payload.meta.get("rgb_preview"):
        # If frontend sends a small data URL preview, we could decode and compute proxy (TODO)
        biodiversity = None
    rec = s_models.SustainabilityRecord(
        paddock_id=payload.paddock_id,
        recorded_at=lambda: datetime.now(timezone.utc)(),
        source=payload.source,
        area_m2=payload.area_m2,
        ndvi_mean=payload.ndvi_mean,
        coverage_pct=payload.coverage_pct,
        dry_biomass_g_m2=biomass,
        carbon_kg=carbon_kg,
        co2e_kg=co2e,
        biodiversity_index=biodiversity,
        notes=payload.notes,
        meta=payload.meta or {}
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {
        "id": rec.id,
        "carbon_kg": carbon_kg,
        "co2e_kg": co2e
    }


class PlannerIn(BaseModel):
    paddocks: List[dict]  # {id, area_ha, biomass_g_m2}
    total_animal_units: float
    planning_horizon_days: Optional[int] = 90
    rest_days_required: Optional[int] = 21


@router.post("/plan", response_model=dict)
def plan(payload: PlannerIn):
    plan = s_planner.plan_rotational_grazing(
        paddocks=payload.paddocks,
        total_animal_units=payload.total_animal_units,
        rest_days_required=payload.rest_days_required,
        planning_horizon_days=payload.planning_horizon_days
    )
    return plan


class DecisionStateIn(BaseModel):
    paddock_id: str
    biomass_kg_ha: float
    ndvi_mean: float
    ndvi_trend: float = 0.0
    canopy_coverage: float = 80.0
    soil_moisture_proxy: float = 0.4
    days_since_graze: int = 14
    stocking_density_au_ha: float = 1.5
    season: str = "spring"


@router.post("/decision/grazing")
def get_grazing_decision(payload: DecisionStateIn):
    state = s_logic.PastureState(**payload.dict())
    return s_logic.grazing_recommendation(state)


@router.post("/decision/harvest")
def get_harvest_decision(payload: DecisionStateIn):
    state = s_logic.PastureState(**payload.dict())
    return s_logic.harvest_recommendation(state)


@router.get("/decision/forecast")
def get_forecast(paddock_id: str, biomass: float, ndvi: float, trend: float = 0.0, days: int = 14):
    state = s_logic.PastureState(
        paddock_id=paddock_id,
        biomass_kg_ha=biomass,
        ndvi_mean=ndvi,
        ndvi_trend=trend,
        canopy_coverage=80.0,
        soil_moisture_proxy=0.4,
        days_since_graze=20,
        stocking_density_au_ha=1.0,
        season="spring"
    )
    yield_val = s_logic.forecast_yield(state, days)
    return {"paddock_id": paddock_id, "forecast_days": days, "forecasted_biomass_kg_ha": yield_val}


@router.get("/decision/alerts")
def get_alerts(ndvi_history: List[float]):
    score = s_logic.anomaly_score(ndvi_history)
    alerts = []
    if score > 0.15:
        alerts.append({
            "type": "ANOMALY",
            "severity": "high",
            "message": "Sudden NDVI variance spike detected. Check for disease or water stress.",
            "score": score
        })
    return {"alerts": alerts}


@router.get("/report/farm/{farm_id}")
def farm_report(farm_id: int, db: Session = Depends(get_db)):
    # aggregate records for the farm
    paddocks = db.query(s_models.Paddock).filter(s_models.Paddock.farm_id == farm_id).all()
    paddock_ids = [p.id for p in paddocks]
    records = db.query(s_models.SustainabilityRecord).filter(s_models.SustainabilityRecord.paddock_id.in_(paddock_ids)).all()
    # compute aggregated totals and trends
    total_carbon = sum((r.carbon_kg or 0.0) for r in records)
    total_co2e = sum((r.co2e_kg or 0.0) for r in records)
    latest_by_paddock = {}
    for r in records:
        pid = r.paddock_id
        if pid not in latest_by_paddock or latest_by_paddock[pid].recorded_at < r.recorded_at:
            latest_by_paddock[pid] = r
    # simple report
    return {
        "farm_id": farm_id,
        "num_records": len(records),
        "total_carbon_kg": total_carbon,
        "total_co2e_kg": total_co2e,
        "latest_by_paddock": {pid: {
            "recorded_at": r.recorded_at.isoformat(),
            "dry_biomass_g_m2": r.dry_biomass_g_m2,
            "co2e_kg": r.co2e_kg
        } for pid, r in latest_by_paddock.items()}
    }
