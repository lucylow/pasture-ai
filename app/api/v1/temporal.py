# app/api/v1/temporal.py
"""
Temporal + Carbon + Optimization API.
End-to-end pipeline: Image2Biomass → Temporal RNN → Carbon → Optimizer.
"""
from fastapi import APIRouter, Query, Body
from typing import List, Optional
from pydantic import BaseModel

from app.mock.temporal_data import generate_mock_timeseries
from app.mock.carbon import mock_carbon_state
from app.mock.pastures import mock_pastures, mock_pasture_operations, PastureState
from app.pipelines.temporal_inference import predict_growth
from app.pipelines.temporal_forecast import forecast_with_uncertainty_auto
from app.pipelines.optimizer import optimize_grazing
from app.pipelines.constrained_optimizer import optimize_with_constraints
from app.schemas.constraints import FarmConstraints
from app.services.audit_logger import log_decision
from app.explanations.generator import explain_grazing_decision

router = APIRouter(prefix="/api/v1/temporal", tags=["temporal-carbon-optimization"])

# Model versions for audit logs
AUDIT_MODEL_VERSIONS = {"image2biomass": "v1.2", "temporal_rnn": "v0.9", "optimizer": "v1.1"}


# --- Schemas ---

class TemporalBiomassPointIn(BaseModel):
    date: str
    biomass_t_ha: float
    rainfall_mm: float
    temperature_c: float
    grazing_pressure: float


class PastureStateIn(BaseModel):
    id: str
    area: float
    biomass: float
    recovery_rate: float
    soil_sensitivity: float


# --- Temporal ---

@router.get("/timeseries/{pasture_id}")
def get_timeseries(
    pasture_id: str = "P1",
    days: int = Query(90, ge=7, le=365),
):
    """Get mock temporal time-series for a pasture."""
    return generate_mock_timeseries(pasture_id, days)


@router.post("/forecast")
def forecast_growth(sequence: List[dict] = Body(...)):
    """
    Predict next-day biomass from past sequence.
    Body: list of {date, biomass_t_ha, rainfall_mm, temperature_c, grazing_pressure}
    """
    pred = predict_growth(sequence)
    return {"next_biomass_t_ha": pred}


@router.post("/forecast/uncertainty")
def forecast_growth_with_uncertainty(
    sequence: List[dict] = Body(...),
    z: float = Query(1.96, description="z for confidence interval (1.96 = 95%)"),
):
    """
    Predict next-day biomass with uncertainty bands.
    Returns mean, lower, upper, std for risk-aware decisions and UI ribbons.
    """
    bands = forecast_with_uncertainty_auto(sequence, z=z)
    forecast_date = sequence[-1].get("date") if sequence and isinstance(sequence[-1], dict) else None
    return {"forecast_date": forecast_date, "biomass_t_ha": bands}


# --- Carbon ---

@router.get("/carbon/mock")
def get_mock_carbon():
    """Get mock carbon state (soil carbon, annual change, ground cover)."""
    return mock_carbon_state()


# --- Optimization ---

@router.get("/pastures/mock")
def get_mock_pastures():
    """Get mock multi-pasture state for optimization."""
    return [
        {"id": p.id, "area": p.area, "biomass": p.biomass, "recovery_rate": p.recovery_rate, "soil_sensitivity": p.soil_sensitivity}
        for p in mock_pastures()
    ]


class OptimizeRequest(BaseModel):
    herd_demand_tonnes: float = 35.0
    horizon_days: int = 90
    pastures: Optional[List[PastureStateIn]] = None


@router.post("/optimize")
def run_optimizer(payload: OptimizeRequest):
    """
    Multi-pasture grazing optimization.
    Uses mock pastures if none provided.
    """
    if payload.pastures:
        ps = [PastureState(p.id, p.area, p.biomass, p.recovery_rate, p.soil_sensitivity) for p in payload.pastures]
    else:
        ps = mock_pastures()
    plan = optimize_grazing(ps, payload.herd_demand_tonnes, payload.horizon_days)

    # Audit log for regulatory compliance
    for item in plan:
        log_decision(
            farm_id="default",
            pasture_id=item["pasture_id"],
            decision_type="grazing",
            model_versions=AUDIT_MODEL_VERSIONS,
            inputs={"herd_demand_tonnes": payload.herd_demand_tonnes, "horizon_days": payload.horizon_days},
            outputs={"graze_tonnes": item["graze_tonnes"], "recovery_days": item["recovery_days"], "carbon_impact": item.get("carbon_impact")},
            constraints={},
            user_id="api",
        )

    explanation = explain_grazing_decision(
        plan=plan,
        herd_demand_tonnes=payload.herd_demand_tonnes,
        context={"horizon_days": payload.horizon_days},
    )
    return {
        "plan": plan,
        "herd_demand_tonnes": payload.herd_demand_tonnes,
        "horizon_days": payload.horizon_days,
        "explanation": explanation,
    }


class ConstrainedOptimizeIn(BaseModel):
    """Request body for constraint-aware optimizer."""

    herd_demand_tonnes: float = 35.0
    max_daily_labor_hours: float = 8.0
    available_water_l_per_day: float = 3000.0
    movable_fence_units: int = 15
    min_recovery_days: int = 21
    pastures: Optional[List[PastureStateIn]] = None


@router.post("/optimize/constrained")
def run_constrained_optimizer(body: ConstrainedOptimizeIn):
    """
    Constraint-aware grazing optimization.
    Respects water, labor, fencing, and recovery rules.
    Returns plan + unmet_demand + resources_remaining for "why not" explanations.
    """
    constraints = FarmConstraints(
        max_daily_labor_hours=body.max_daily_labor_hours,
        available_water_l_per_day=body.available_water_l_per_day,
        movable_fence_units=body.movable_fence_units,
        min_recovery_days=body.min_recovery_days,
    )
    if body.pastures:
        pastures = [
            {"id": p.id, "biomass": p.biomass, "area": p.area, "recovery_rate": p.recovery_rate}
            for p in body.pastures
        ]
    else:
        pastures = [
            {"id": p.id, "biomass": p.biomass, "area": p.area, "recovery_rate": p.recovery_rate}
            for p in mock_pastures()
        ]
    operations = mock_pasture_operations()
    result = optimize_with_constraints(
        pastures=pastures,
        operations=operations,
        constraints=constraints,
        herd_demand_tonnes=body.herd_demand_tonnes,
    )

    # Audit log for constraint-aware decisions
    plan = result.get("plan", [])
    constraints_dict = {
        "max_daily_labor_hours": body.max_daily_labor_hours,
        "available_water_l_per_day": body.available_water_l_per_day,
        "movable_fence_units": body.movable_fence_units,
        "min_recovery_days": body.min_recovery_days,
    }
    for item in plan:
        log_decision(
            farm_id="default",
            pasture_id=item.get("pasture_id", ""),
            decision_type="optimization",
            model_versions=AUDIT_MODEL_VERSIONS,
            inputs={"herd_demand_tonnes": body.herd_demand_tonnes},
            outputs=item,
            constraints=constraints_dict,
            user_id="api",
        )

    return result


# --- Model cards ---

@router.get("/model-cards/image2biomass")
def get_image2biomass_model_card():
    """Serve Image2Biomass model card (investor/regulator ready)."""
    from pathlib import Path
    import json

    path = Path(__file__).resolve().parents[3] / "docs" / "model_cards" / "image2biomass.json"
    if path.exists():
        return json.loads(path.read_text())
    return {"model_name": "Image2Biomass", "note": "Model card not found"}


# --- End-to-end pipeline ---

@router.get("/pipeline/{pasture_id}")
def full_pipeline(
    pasture_id: str = "P1",
    days: int = Query(90, ge=7),
):
    """
    End-to-end demo: timeseries → forecast → carbon → optimization.
    1. Image → biomass map (assume Image2Biomass already ran)
    2. Tile aggregation → pasture mean (from mock timeseries)
    3. Temporal RNN → growth forecast
    4. Carbon model → soil impact
    5. Optimization solver → grazing plan
    """
    ts = generate_mock_timeseries(pasture_id, days)
    history = ts["history"]
    current_mean = sum(h["biomass_t_ha"] for h in history[-7:]) / min(7, len(history))

    # 3. Temporal forecast
    next_biomass = predict_growth(history[-30:] if len(history) >= 30 else history)

    # 4. Carbon state
    carbon = mock_carbon_state()

    # 5. Optimization with all pastures
    plan = optimize_grazing(mock_pastures(), herd_demand_tonnes=35.0, horizon_days=90)

    # Audit log for end-to-end pipeline
    log_decision(
        farm_id="default",
        pasture_id=pasture_id,
        decision_type="grazing",
        model_versions=AUDIT_MODEL_VERSIONS,
        inputs={
            "current_biomass_mean_t_ha": round(current_mean, 3),
            "days": days,
        },
        outputs={
            "next_day_forecast_t_ha": next_biomass,
            "carbon": carbon,
            "grazing_plan": plan,
        },
        constraints={},
        user_id="api",
    )

    return {
        "pasture_id": pasture_id,
        "current_biomass_mean_t_ha": round(current_mean, 3),
        "next_day_forecast_t_ha": next_biomass,
        "carbon": carbon,
        "grazing_plan": plan,
    }
