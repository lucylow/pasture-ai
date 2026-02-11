# app/carbon/credits.py
"""
Carbon credit calculation for PastureAI.
Converts soil carbon change to tradeable credits (tCO2e) with methodology alignment.
References: VCS VM0022, Verra Grassland, Australian ERF soil carbon methods.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Literal

# tC → tCO2e: molecular weight ratio 44/12
C_TO_CO2E = 44.0 / 12.0


@dataclass
class CarbonCreditEligibility:
    """Eligibility checks for carbon credit programs."""

    ground_cover_ok: bool
    min_ground_cover: float
    baseline_met: bool
    additionality_ok: bool
    within_permanence_window: bool
    issues: List[str] = field(default_factory=list)


@dataclass
class CarbonCreditEstimate:
    """Structured carbon credit estimate for farmer/regulator."""

    soil_carbon_change_tc_ha_yr: float
    co2e_t_yr: float
    eligible_credits_tco2e: float
    permanence_buffer_pct: float
    methodology: str
    eligibility: CarbonCreditEligibility
    methodology_ref: str


def tc_to_co2e(tc: float) -> float:
    """Convert tonnes C to tonnes CO2 equivalent."""
    return round(tc * C_TO_CO2E, 4)


def check_eligibility(
    ground_cover: float,
    annual_change_tc_ha: float,
    min_ground_cover: float = 0.70,
    min_sequestration_tc_ha: float = 0.05,
) -> CarbonCreditEligibility:
    """
    Basic eligibility for soil carbon programs.
    - Ground cover typically ≥70% for grassland methods
    - Positive sequestration required
    """
    issues = []
    ground_cover_ok = ground_cover >= min_ground_cover
    if not ground_cover_ok:
        issues.append(f"Ground cover {ground_cover:.0%} below {min_ground_cover:.0%} threshold")

    baseline_met = annual_change_tc_ha > 0
    if not baseline_met:
        issues.append("No net sequestration above baseline")

    additionality_ok = annual_change_tc_ha >= min_sequestration_tc_ha
    if not additionality_ok and baseline_met:
        issues.append(f"Change {annual_change_tc_ha:.3f} tC/ha/yr below typical minimum for credits")

    return CarbonCreditEligibility(
        ground_cover_ok=ground_cover_ok,
        min_ground_cover=min_ground_cover,
        baseline_met=baseline_met,
        additionality_ok=additionality_ok,
        within_permanence_window=True,
        issues=issues,
    )


def calculate_carbon_credits(
    soil_carbon_change_tc_ha_yr: float,
    area_ha: float,
    ground_cover: float = 0.90,
    permanence_buffer_pct: float = 0.05,
    methodology: Literal["VM0022", "ERF_soil", "generic"] = "generic",
) -> CarbonCreditEstimate:
    """
    Convert soil carbon change to eligible carbon credits (tCO2e).

    Args:
        soil_carbon_change_tc_ha_yr: Annual soil C change (tC/ha/yr) from model
        area_ha: Pasture area in hectares
        ground_cover: Ground cover fraction (0–1)
        permanence_buffer_pct: Fraction withheld for permanence (e.g. 0.05 = 5%)
        methodology: Methodology reference

    Returns:
        CarbonCreditEstimate with eligible credits and eligibility
    """
    co2e_total = soil_carbon_change_tc_ha_yr * area_ha * C_TO_CO2E
    buffer = 1.0 - permanence_buffer_pct
    eligible_raw = max(0.0, co2e_total * buffer)
    eligible_credits = round(eligible_raw, 4)

    eligibility = check_eligibility(
        ground_cover=ground_cover,
        annual_change_tc_ha=soil_carbon_change_tc_ha_yr,
    )

    # Reduce credits if not fully eligible
    if not eligibility.ground_cover_ok:
        eligible_credits = 0.0
    elif not eligibility.additionality_ok:
        eligible_credits = round(eligible_credits * 0.5, 4)

    methodology_refs = {
        "VM0022": "Verra VCS VM0022 - Methodology for Improved Agricultural Land Management",
        "ERF_soil": "Australian ERF - Carbon Credits (Carbon Farming Initiative) (Measurement of Soil Carbon Sequestration) Methodology Determination 2021",
        "generic": "PastureAI generic soil carbon estimate (align to program for verification)",
    }

    return CarbonCreditEstimate(
        soil_carbon_change_tc_ha_yr=round(soil_carbon_change_tc_ha_yr, 4),
        co2e_t_yr=round(co2e_total, 4),
        eligible_credits_tco2e=eligible_credits,
        permanence_buffer_pct=permanence_buffer_pct,
        methodology=methodology,
        eligibility=eligibility,
        methodology_ref=methodology_refs.get(methodology, methodology_refs["generic"]),
    )


def estimate_credits_from_carbon_state(
    carbon_state: Dict[str, Any],
    area_ha: float,
    methodology: Literal["VM0022", "ERF_soil", "generic"] = "generic",
) -> CarbonCreditEstimate:
    """
    Convenience: compute credits from carbon_state dict (API format).
    carbon_state: {soil_carbon_t_ha, annual_change_t_ha, ground_cover, ...}
    """
    annual_change = float(carbon_state.get("annual_change_t_ha", carbon_state.get("annual_change_tc_ha_yr", 0.0)))
    ground_cover = float(carbon_state.get("ground_cover", 0.90))
    return calculate_carbon_credits(
        soil_carbon_change_tc_ha_yr=annual_change,
        area_ha=area_ha,
        ground_cover=ground_cover,
        methodology=methodology,
    )
