# app/mock/carbon.py
"""Mock carbon state for PastureAI carbon accounting."""


def mock_carbon_state() -> dict:
    return {
        "soil_carbon_t_ha": 42.5,
        "annual_change_t_ha": 0.38,
        "ground_cover": 0.91,
        "confidence": 0.88,
    }
