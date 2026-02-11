"""
Pydantic schemas for PastureAI AI/Image2Biomass mock data.
Mirrors frontend mock structures for API contracts, regulatory export, and compliance.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# --- 1. Model Registry (snake_case for API) ---
class TrainedOn(BaseModel):
    images: int
    farms: int
    regions: List[str]
    pasture_types: List[str]


class ValidationMetrics(BaseModel):
    rmse_t_ha: float
    r2: float
    bias: float


class Image2BiomassModel(BaseModel):
    model_id: str
    architecture: str
    trained_on: TrainedOn
    last_retrained: str
    validation: ValidationMetrics
    status: str


# --- 2. Feature Attribution ---
class FeatureContribution(BaseModel):
    feature: str
    weight: float


class FeatureAttribution(BaseModel):
    pasture_id: str
    tile_id: str
    contributions: List[FeatureContribution]
    explanation_summary: str


# --- 3. Temporal Model State ---
class StressIndicators(BaseModel):
    drought_risk: float
    overgrazing_risk: float


class TemporalModelState(BaseModel):
    pasture_id: str
    model_type: str
    lookback_days: int
    growth_phase: str
    learned_growth_rate_t_ha_per_day: float
    seasonality_factor: float
    stress_indicators: StressIndicators


# --- 4. Uncertainty Breakdown ---
class UncertaintyComponent(BaseModel):
    source: str
    contribution: float


class UncertaintyBreakdown(BaseModel):
    total_std: float
    components: List[UncertaintyComponent]
    interpretation: str


# --- 5. Confidence Tiles ---
class ConfidenceTile(BaseModel):
    tile_id: str
    confidence_score: float
    reason: str


# --- 6. Model Drift ---
class ModelDriftStatus(BaseModel):
    model_id: str
    window_days: int
    input_drift: Dict[str, Any]
    output_drift: Dict[str, Any]
    alert: Optional[str] = None


# --- 7. Ensemble Decision ---
class EnsembleModel(BaseModel):
    name: str
    weight: float


class EnsembleDecision(BaseModel):
    pasture_id: str
    models: List[EnsembleModel]
    ensemble_method: str
    stability_score: float


# --- 8. Optimization Engine ---
class OptimizationConstraints(BaseModel):
    min_residual_biomass_t_ha: float
    max_graze_days: int
    labor_hours: int
    water_availability: str


class ExpectedOutcome(BaseModel):
    utilization_efficiency: float
    recovery_time_days: int


class SelectedPlan(BaseModel):
    graze_area_percent: int
    graze_start: str
    graze_duration_days: int
    expected_outcome: ExpectedOutcome


class OptimizationEngineState(BaseModel):
    objective: str
    constraints: OptimizationConstraints
    evaluated_plans: int
    selected_plan: SelectedPlan


# --- 9. Model Card ---
class ModelCard(BaseModel):
    name: str
    intended_use: str
    limitations: List[str]
    ethical_considerations: str
    update_policy: str


# --- 10. AI Decision Trace ---
class AIDecisionTrace(BaseModel):
    decision_id: str
    pipeline: List[str]
    human_override_allowed: bool
    final_decision: str


# --- Full AI summary for regulatory export ---
class AIRegulatorySummary(BaseModel):
    """Aggregated AI summary for regulatory PDF/CSV export."""

    model_registry: Optional[Dict[str, Any]] = None
    model_card: Optional[Dict[str, Any]] = None
    feature_attribution: Optional[Dict[str, Any]] = None
    uncertainty_breakdown: Optional[Dict[str, Any]] = None
    model_drift: Optional[Dict[str, Any]] = None
    decision_trace: Optional[Dict[str, Any]] = None
    confidence_summary: Optional[Dict[str, Any]] = None
