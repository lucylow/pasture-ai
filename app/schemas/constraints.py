# app/schemas/constraints.py
"""
Farm constraints and pasture operational metadata for constraint-aware optimization.
"""
from pydantic import BaseModel


class FarmConstraints(BaseModel):
    """Farm-level operational constraints."""

    max_daily_labor_hours: float
    available_water_l_per_day: float
    movable_fence_units: int
    min_recovery_days: int


class PastureOperationalState(BaseModel):
    """Per-pasture operational metadata."""

    pasture_id: str
    water_requirement_l_per_day: float
    labor_hours_per_move: float
    fence_units_required: int
