# app/models/carbon.py
"""
Carbon accumulation model: biomass + recovery → soil carbon outcomes.
Simple, explainable, auditable — not offsets hype, just accounting.
"""


def estimate_carbon_change(
    biomass_delta_t_ha: float,
    grazing_pressure: float,
    soil_sensitivity: float,
) -> float:
    """
    Returns annualized soil carbon change (tC/ha/year).
    Assumptions:
    - Sequestration proportional to net biomass growth
    - Grazing penalty reduces soil carbon gains
    - Soil sensitivity (compaction, etc.) increases loss
    """
    sequestration = biomass_delta_t_ha * 0.45
    grazing_penalty = grazing_pressure * 0.3
    soil_penalty = soil_sensitivity * 0.2

    net = sequestration - grazing_penalty - soil_penalty
    return round(net, 3)


def carbon_state(
    soil_carbon_t_ha: float,
    annual_change_t_ha: float,
    ground_cover: float = 0.9,
    confidence: float = 0.88,
) -> dict:
    """Build carbon state dict for API responses."""
    return {
        "soil_carbon_t_ha": soil_carbon_t_ha,
        "annual_change_t_ha": annual_change_t_ha,
        "ground_cover": ground_cover,
        "confidence": confidence,
    }
