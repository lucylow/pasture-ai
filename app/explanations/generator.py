# app/explanations/generator.py
"""
Farmer-facing explanation text generation.
Plain language, no jargon, actionable — builds trust and clarity.
"""
from typing import Any, Dict, List, Optional


def explain_grazing_decision(
    plan: List[Dict[str, Any]],
    herd_demand_tonnes: float,
    context: Optional[Dict] = None,
) -> Dict[str, str]:
    """
    Generate plain-language explanation for a grazing plan.

    Returns:
        summary: One-line overview
        rationale: Bullet-point rationale
        next_steps: Suggested actions
    """
    if not plan:
        return {
            "summary": "No pastures are ready to graze right now. Consider resting paddocks or adjusting herd demand.",
            "rationale": "Current biomass and recovery rates don't support grazing within safe limits.",
            "next_steps": "Check recovery status in 7–14 days, or reduce herd demand.",
        }

    first = plan[0]
    pasture_id = first.get("pasture_id", "this pasture")
    graze_tonnes = first.get("graze_tonnes", 0)
    recovery_days = first.get("recovery_days", 0)

    summary = (
        f"We recommend starting with {pasture_id}: graze {graze_tonnes:.1f} tonnes over the rotation, "
        f"then rest for {recovery_days} days to let it recover."
    )

    rationales = [
        f"{pasture_id} has the highest biomass and can support the most grazing without stressing the sward.",
        f"After grazing, a {recovery_days}-day rest gives roots time to regrow and keeps soil carbon stable.",
        f"This plan meets your herd demand of {herd_demand_tonnes:.1f} tonnes.",
    ]
    if len(plan) > 1:
        others = ", ".join(p.get("pasture_id", "") for p in plan[1:4])
        rationales.append(f"Then rotate to {others} in order as each pasture reaches target biomass.")

    next_steps = [
        f"Move stock to {pasture_id} when ready.",
        f"Set a reminder to rotate in about {recovery_days} days.",
    ]
    if context and context.get("unmet_demand", 0) > 0:
        next_steps.append(
            f"Note: {context['unmet_demand']:.1f} tonnes of demand couldn't be met. Consider supplementary feed or resting more paddocks."
        )

    return {
        "summary": summary,
        "rationale": " ".join(rationales),
        "next_steps": " | ".join(next_steps),
    }


def explain_counterfactual(result: Dict[str, Any]) -> Dict[str, str]:
    """
    Explain a "what if we graze later" counterfactual in plain language.

    Returns:
        summary: One-line takeaway
        interpretation: UI-ready paragraph (risk, trade-offs)
    """
    delay_days = result.get("delay_days", 7)
    biomass_change = result.get("biomass_change_t_ha", 0)
    baseline_std = result.get("risk_change", {}).get("baseline_std", 0.18)
    delayed_std = result.get("risk_change", {}).get("delayed_std", 0.25)

    if biomass_change >= 0:
        summary = (
            f"Waiting {delay_days} more days is likely to add about {biomass_change:+.2f} t/ha of biomass, "
            f"giving you more pasture to work with."
        )
    else:
        summary = (
            f"Waiting {delay_days} more days may reduce biomass by about {abs(biomass_change):.2f} t/ha, "
            f"so grazing sooner could be better."
        )

    std_increase = (delayed_std - baseline_std) / baseline_std if baseline_std > 0 else 0
    pct_increase = int(std_increase * 100)

    if pct_increase > 20:
        interpretation = (
            f"Waiting {delay_days} days likely increases biomass by {biomass_change:+.2f} t/ha, "
            f"but forecast uncertainty goes up by about {pct_increase}% because we're looking further ahead. "
            "If weather or conditions change, the extra biomass might not eventuate."
        )
    else:
        interpretation = (
            f"Waiting {delay_days} days likely adds {biomass_change:+.2f} t/ha with only a small "
            f"increase in uncertainty. That's decision intelligence you can act on."
        )

    return {
        "summary": summary,
        "interpretation": interpretation,
    }


def explain_carbon_impact(
    carbon_state: Dict[str, Any],
    credit_estimate: Optional[Dict[str, Any]] = None,
) -> Dict[str, str]:
    """
    Explain carbon state and optional credit estimate for farmers.

    Returns:
        summary: One-line carbon status
        credits_explanation: Plain-language credit explanation (if credits provided)
        soil_health_note: Brief soil/pasture health note
    """
    annual_change = carbon_state.get("annual_change_t_ha", carbon_state.get("annual_change_tc_ha_yr", 0))
    ground_cover = carbon_state.get("ground_cover", 0.9)
    soil_carbon = carbon_state.get("soil_carbon_t_ha", 0)

    if annual_change > 0:
        summary = (
            f"Your pasture is building soil carbon at about {annual_change:.2f} tC/ha per year. "
            f"Ground cover is {ground_cover:.0%}, which supports healthy soil."
        )
    elif annual_change < 0:
        summary = (
            f"Soil carbon is trending down by about {abs(annual_change):.2f} tC/ha per year. "
            "Consider longer rest periods or lighter grazing to help soil recover."
        )
    else:
        summary = (
            "Soil carbon is holding steady. Good ground cover and recovery periods help keep it that way."
        )

    soil_health_note = (
        f"Ground cover at {ground_cover:.0%} helps protect soil from erosion and supports carbon storage. "
        "Rotating stock and resting paddocks are key."
    )

    credits_explanation = ""
    if credit_estimate:
        eligible = credit_estimate.get("eligible_credits_tco2e", 0)
        eligibility = credit_estimate.get("eligibility", {})
        if isinstance(eligibility, dict):
            issues = eligibility.get("issues", [])
        else:
            issues = getattr(eligibility, "issues", [])

        if eligible > 0:
            credits_explanation = (
                f"Based on current sequestration, this could translate to roughly {eligible:.2f} tCO2e "
                "of carbon credits per year, depending on your program and verification. "
                "Check with your carbon project developer for exact eligibility."
            )
        elif issues:
            credits_explanation = (
                "Carbon credit eligibility needs a closer look: "
                + "; ".join(issues[:3])
                + ". Talk to your carbon advisor about steps to qualify."
            )
        else:
            credits_explanation = (
                "Carbon credits depend on methodology, verification, and program rules. "
                "Your sequestration trend is positive — worth discussing with a carbon project developer."
            )

    return {
        "summary": summary,
        "credits_explanation": credits_explanation or "No credit estimate provided.",
        "soil_health_note": soil_health_note,
    }


def explain_constraint_issue(
    constraint_name: str,
    required: float,
    available: float,
    pasture_id: str = "",
) -> str:
    """
    Explain why a constraint blocked a pasture from the plan.
    """
    short = constraint_name.replace("_", " ").title()
    return (
        f"{pasture_id + ': ' if pasture_id else ''}"
        f"Not enough {short}. You need {required:.1f} but only have {available:.1f}. "
        f"Consider increasing capacity or skipping this pasture for now."
    )
