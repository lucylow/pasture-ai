# app/api/v1/regulatory.py
"""
Regulatory-grade API: audit, counterfactual, exports, drift monitoring.
Turns PastureAI into a decision system that survives scrutiny.
"""
import json
import tempfile
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, Query
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

from app.exports.csv_export import export_grazing_csv
from app.exports.pdf_report import generate_regulatory_pdf
from app.exports.regulatory_pack import generate_regulatory_pack
from app.mock.pastures import mock_pastures
from app.monitoring.monitor import monitor_model_drift
from app.monitoring.baseline import save_baseline, load_baseline, list_baselines
from app.simulation.counterfactual import simulate_graze_delay
from app.simulation.digital_twin import build_playback_timeline
from app.carbon.credits import calculate_carbon_credits, estimate_credits_from_carbon_state
from app.explanations.generator import (
    explain_grazing_decision,
    explain_counterfactual,
    explain_carbon_impact,
)

router = APIRouter(prefix="/api/v1/regulatory", tags=["regulatory"])

# Audit log path (matches audit_logger default)
_AUDIT_PATH = Path(__file__).resolve().parents[3] / "audit_logs" / "audit.jsonl"

# Model versions for audit (centralize here for consistency)
MODEL_VERSIONS = {
    "image2biomass": "v1.2",
    "temporal_rnn": "v0.9",
    "optimizer": "v1.1",
}


# --- Audit log query ---


@router.get("/audit/logs")
def get_audit_logs(
    limit: int = Query(100, ge=1, le=1000),
    decision_type: str | None = Query(None, description="Filter: grazing | carbon | optimization"),
):
    """Read recent audit log entries (from append-only store). For dev; use BigQuery/S3 in production."""
    if not _AUDIT_PATH.exists():
        return {"logs": [], "count": 0}
    logs = []
    with open(_AUDIT_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                if decision_type and entry.get("decision_type") != decision_type:
                    continue
                logs.append(entry)
            except json.JSONDecodeError:
                continue
    logs = logs[-limit:][::-1]  # most recent first
    return {"logs": logs, "count": len(logs)}


# --- Counterfactual simulation ---


class GrazeDelayRequest(BaseModel):
    pasture_id: str = "P1"
    current_date: Optional[str] = None
    delay_days: int = 7


@router.post("/simulate/graze-delay")
def run_graze_delay_simulation(body: GrazeDelayRequest = Body(...)):
    """
    "What if we graze N days later?"
    Returns biomass change, risk change, and farmer-facing explanation.
    """
    pasture = next((p for p in mock_pastures() if p.id == body.pasture_id), None)
    if pasture is None:
        pasture = type("Pasture", (), {"id": body.pasture_id, "biomass": 2.8, "recovery_rate": 0.06})()

    current_d = date.fromisoformat(body.current_date) if body.current_date else date.today()
    result = simulate_graze_delay(pasture, current_d, body.delay_days)
    result["explanation"] = explain_counterfactual(result)
    return result


class MultiScenarioRequest(BaseModel):
    pasture_id: str = "P1"
    current_date: Optional[str] = None
    delay_days_list: List[int] = [0, 7, 14, 21, 28]


@router.post("/simulate/graze-delay/multi")
def run_multi_scenario_simulation(body: MultiScenarioRequest = Body(...)):
    """
    "What if we graze later?" — multiple scenarios for slider/UI.
    Returns baseline + each delay scenario for risk comparison.
    """
    pasture = next((p for p in mock_pastures() if p.id == body.pasture_id), None)
    if pasture is None:
        pasture = type("Pasture", (), {"id": body.pasture_id, "biomass": 2.8, "recovery_rate": 0.06})()

    current_d = date.fromisoformat(body.current_date) if body.current_date else date.today()
    scenarios = []
    for delay in body.delay_days_list:
        r = simulate_graze_delay(pasture, current_d, delay)
        r["explanation"] = explain_counterfactual(r)
        scenarios.append({"delay_days": delay, "result": r})

    return {
        "pasture_id": body.pasture_id,
        "current_date": current_d.isoformat(),
        "scenarios": scenarios,
    }


# --- Regulatory exports ---


class ExportGrazingRequest(BaseModel):
    decisions: List[Dict[str, Any]]


@router.post("/export/grazing-csv")
def export_grazing_csv_endpoint(body: ExportGrazingRequest = Body(...)):
    """Export grazing decisions to CSV for regulatory submission."""
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as f:
        path = export_grazing_csv(body.decisions, f.name)
    return FileResponse(
        path,
        media_type="text/csv",
        filename="pastureai_grazing_export.csv",
    )


class RegulatorySummaryRequest(BaseModel):
    summary: Dict[str, Any]


@router.post("/export/regulatory-pdf")
def export_regulatory_pdf_endpoint(body: RegulatorySummaryRequest = Body(...)):
    """Generate regulatory PDF report from summary."""
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
            path = generate_regulatory_pdf(body.summary, f.name)
        return FileResponse(
            str(path),
            media_type="application/pdf",
            filename="pastureai_regulatory_report.pdf",
        )
    except ImportError as e:
        return {"error": str(e), "hint": "pip install reportlab"}


class RegulatoryPackRequest(BaseModel):
    decisions: List[Dict[str, Any]]
    summary: Dict[str, Any]


@router.post("/export/regulatory-pack")
def export_regulatory_pack_endpoint(body: RegulatoryPackRequest = Body(...)):
    """Export CSV + PDF as a single ZIP for regulatory submission."""
    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as f:
        path = generate_regulatory_pack(body.decisions, body.summary, f.name)
    return FileResponse(
        str(path),
        media_type="application/zip",
        filename="pastureai_regulatory_pack.zip",
    )


# --- Model drift monitoring ---


class DriftCheckRequest(BaseModel):
    reference_stats: Dict[str, float]
    live_stats: Dict[str, float]
    threshold: float = 0.15


@router.post("/monitoring/drift")
def check_model_drift(body: DriftCheckRequest = Body(...)):
    """
    Compare reference stats to live stats.
    drift_detected + alerts → trigger retraining, warning, model card update.
    """
    return monitor_model_drift(
        body.reference_stats,
        body.live_stats,
        threshold=body.threshold,
    )


class DriftBaselineRequest(BaseModel):
    model_name: str = "image2biomass"
    stats: Dict[str, float]


@router.post("/monitoring/baseline/save")
def save_drift_baseline(body: DriftBaselineRequest = Body(...)):
    """Capture reference stats for drift monitoring. Use before deployment."""
    return save_baseline(body.model_name, body.stats)


@router.get("/monitoring/baseline/{model_name}")
def get_drift_baseline(model_name: str):
    """Load stored reference stats for a model."""
    baseline = load_baseline(model_name)
    if baseline is None:
        return {"error": "No baseline found", "model_name": model_name}
    return baseline


@router.get("/monitoring/baselines")
def list_drift_baselines():
    """List all stored drift baselines."""
    return {"baselines": list_baselines()}


# --- Digital twin playback ---


@router.get("/playback")
def get_digital_twin_playback(
    pasture_ids: Optional[str] = Query(None, description="Comma-separated pasture IDs"),
    start_date: Optional[str] = Query(None),
    horizon_days: int = Query(90, ge=7, le=365),
    herd_demand_tonnes: float = Query(35.0, ge=1),
):
    """
    Digital twin playback: timeline of pasture states + grazing events for demos.
    Frontend animates over frames to show day-by-day simulation.
    """
    start_d = date.fromisoformat(start_date) if start_date else date.today()
    ids = [x.strip() for x in pasture_ids.split(",")] if pasture_ids else None
    return build_playback_timeline(
        pasture_ids=ids,
        start_date=start_d,
        horizon_days=horizon_days,
        herd_demand_tonnes=herd_demand_tonnes,
    )


# --- Carbon credits ---


class CarbonCreditRequest(BaseModel):
    soil_carbon_change_tc_ha_yr: float
    area_ha: float
    ground_cover: float = 0.90
    methodology: str = "generic"


class CarbonCreditFromStateRequest(BaseModel):
    carbon_state: Dict[str, Any]
    area_ha: float
    methodology: str = "generic"


@router.post("/carbon/credits")
def calculate_carbon_credits_endpoint(body: CarbonCreditRequest = Body(...)):
    """
    Convert soil carbon change to eligible carbon credits (tCO2e).
    Methodology: generic | VM0022 | ERF_soil
    """
    est = calculate_carbon_credits(
        soil_carbon_change_tc_ha_yr=body.soil_carbon_change_tc_ha_yr,
        area_ha=body.area_ha,
        ground_cover=body.ground_cover,
        methodology=body.methodology,
    )
    return {
        "soil_carbon_change_tc_ha_yr": est.soil_carbon_change_tc_ha_yr,
        "co2e_t_yr": est.co2e_t_yr,
        "eligible_credits_tco2e": est.eligible_credits_tco2e,
        "permanence_buffer_pct": est.permanence_buffer_pct,
        "methodology": est.methodology,
        "methodology_ref": est.methodology_ref,
        "eligibility": {
            "ground_cover_ok": est.eligibility.ground_cover_ok,
            "baseline_met": est.eligibility.baseline_met,
            "additionality_ok": est.eligibility.additionality_ok,
            "issues": est.eligibility.issues,
        },
    }


@router.post("/carbon/credits/from-state")
def credits_from_carbon_state_endpoint(body: CarbonCreditFromStateRequest = Body(...)):
    """Compute credits from carbon_state dict (e.g. from /temporal/carbon/mock)."""
    est = estimate_credits_from_carbon_state(
        carbon_state=body.carbon_state,
        area_ha=body.area_ha,
        methodology=body.methodology,
    )
    return {
        "soil_carbon_change_tc_ha_yr": est.soil_carbon_change_tc_ha_yr,
        "co2e_t_yr": est.co2e_t_yr,
        "eligible_credits_tco2e": est.eligible_credits_tco2e,
        "methodology": est.methodology,
        "methodology_ref": est.methodology_ref,
        "eligibility": {
            "ground_cover_ok": est.eligibility.ground_cover_ok,
            "baseline_met": est.eligibility.baseline_met,
            "additionality_ok": est.eligibility.additionality_ok,
            "issues": est.eligibility.issues,
        },
    }


# --- Farmer-facing explanations ---


class ExplainGrazingRequest(BaseModel):
    plan: List[Dict[str, Any]]
    herd_demand_tonnes: float = 35.0
    context: Optional[Dict[str, Any]] = None


class ExplainCounterfactualRequest(BaseModel):
    result: Dict[str, Any]


class ExplainCarbonRequest(BaseModel):
    carbon_state: Dict[str, Any]
    credit_estimate: Optional[Dict[str, Any]] = None


@router.post("/explain/grazing")
def explain_grazing_endpoint(body: ExplainGrazingRequest = Body(...)):
    """Generate plain-language explanation for a grazing plan."""
    return explain_grazing_decision(
        plan=body.plan,
        herd_demand_tonnes=body.herd_demand_tonnes,
        context=body.context,
    )


@router.post("/explain/counterfactual")
def explain_counterfactual_endpoint(body: ExplainCounterfactualRequest = Body(...)):
    """Generate farmer-facing explanation for a counterfactual result."""
    return explain_counterfactual(body.result)


@router.post("/explain/carbon")
def explain_carbon_endpoint(body: ExplainCarbonRequest = Body(...)):
    """Generate plain-language explanation for carbon state and optional credits."""
    return explain_carbon_impact(
        carbon_state=body.carbon_state,
        credit_estimate=body.credit_estimate,
    )


# --- Carbon credits ---


class CarbonCreditRequest(BaseModel):
    soil_carbon_change_tc_ha_yr: float
    area_ha: float
    ground_cover: float = 0.90
    methodology: str = "generic"


class CarbonCreditFromStateRequest(BaseModel):
    carbon_state: Dict[str, Any]
    area_ha: float
    methodology: str = "generic"


@router.post("/carbon/credits")
def calculate_carbon_credits_endpoint(body: CarbonCreditRequest = Body(...)):
    """
    Convert soil carbon change to eligible carbon credits (tCO2e).
    Methodology: generic | VM0022 | ERF_soil
    """
    est = calculate_carbon_credits(
        soil_carbon_change_tc_ha_yr=body.soil_carbon_change_tc_ha_yr,
        area_ha=body.area_ha,
        ground_cover=body.ground_cover,
        methodology=body.methodology,
    )
    # Serialize dataclass for JSON
    return {
        "soil_carbon_change_tc_ha_yr": est.soil_carbon_change_tc_ha_yr,
        "co2e_t_yr": est.co2e_t_yr,
        "eligible_credits_tco2e": est.eligible_credits_tco2e,
        "permanence_buffer_pct": est.permanence_buffer_pct,
        "methodology": est.methodology,
        "methodology_ref": est.methodology_ref,
        "eligibility": {
            "ground_cover_ok": est.eligibility.ground_cover_ok,
            "baseline_met": est.eligibility.baseline_met,
            "additionality_ok": est.eligibility.additionality_ok,
            "issues": est.eligibility.issues,
        },
    }


@router.post("/carbon/credits/from-state")
def credits_from_carbon_state_endpoint(body: CarbonCreditFromStateRequest = Body(...)):
    """Compute credits from carbon_state dict (e.g. from /temporal/carbon/mock)."""
    est = estimate_credits_from_carbon_state(
        carbon_state=body.carbon_state,
        area_ha=body.area_ha,
        methodology=body.methodology,
    )
    return {
        "soil_carbon_change_tc_ha_yr": est.soil_carbon_change_tc_ha_yr,
        "co2e_t_yr": est.co2e_t_yr,
        "eligible_credits_tco2e": est.eligible_credits_tco2e,
        "methodology": est.methodology,
        "methodology_ref": est.methodology_ref,
        "eligibility": {
            "ground_cover_ok": est.eligibility.ground_cover_ok,
            "baseline_met": est.eligibility.baseline_met,
            "additionality_ok": est.eligibility.additionality_ok,
            "issues": est.eligibility.issues,
        },
    }


# --- Farmer-facing explanations ---


class ExplainGrazingRequest(BaseModel):
    plan: List[Dict[str, Any]]
    herd_demand_tonnes: float = 35.0
    context: Optional[Dict[str, Any]] = None


class ExplainCounterfactualRequest(BaseModel):
    result: Dict[str, Any]


class ExplainCarbonRequest(BaseModel):
    carbon_state: Dict[str, Any]
    credit_estimate: Optional[Dict[str, Any]] = None


@router.post("/explain/grazing")
def explain_grazing_endpoint(body: ExplainGrazingRequest = Body(...)):
    """Generate plain-language explanation for a grazing plan."""
    return explain_grazing_decision(
        plan=body.plan,
        herd_demand_tonnes=body.herd_demand_tonnes,
        context=body.context,
    )


@router.post("/explain/counterfactual")
def explain_counterfactual_endpoint(body: ExplainCounterfactualRequest = Body(...)):
    """Generate farmer-facing explanation for a counterfactual result."""
    return explain_counterfactual(body.result)


@router.post("/explain/carbon")
def explain_carbon_endpoint(body: ExplainCarbonRequest = Body(...)):
    """Generate plain-language explanation for carbon state and optional credits."""
    return explain_carbon_impact(
        carbon_state=body.carbon_state,
        credit_estimate=body.credit_estimate,
    )
