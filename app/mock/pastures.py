# app/mock/pastures.py
"""Mock multi-pasture state for optimization solver."""

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class PastureState:
    id: str
    area: float  # ha
    biomass: float  # t/ha
    recovery_rate: float  # t/ha/day
    soil_sensitivity: float  # 0–1


def mock_pastures() -> List[PastureState]:
    return [
        PastureState("P1", 12, 2.9, 0.07, 0.2),
        PastureState("P2", 18, 3.6, 0.05, 0.35),
        PastureState("P3", 10, 1.8, 0.09, 0.15),
        PastureState("P4", 25, 4.2, 0.04, 0.45),
    ]


def mock_pasture_operations() -> List[Dict]:
    """Per-pasture operational metadata for constrained optimizer."""
    return [
        {"pasture_id": "P1", "water_requirement_l_per_day": 800, "labor_hours_per_move": 2.0, "fence_units_required": 4},
        {"pasture_id": "P2", "water_requirement_l_per_day": 600, "labor_hours_per_move": 1.5, "fence_units_required": 3},
        {"pasture_id": "P3", "water_requirement_l_per_day": 400, "labor_hours_per_move": 1.0, "fence_units_required": 2},
        {"pasture_id": "P4", "water_requirement_l_per_day": 1200, "labor_hours_per_move": 2.5, "fence_units_required": 6},
    ]
