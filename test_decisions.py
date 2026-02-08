# test_decisions.py
from app.sustainability.decision_logic import PastureState, grazing_recommendation, harvest_recommendation, forecast_yield

def test_logic():
    # Case 1: High pressure
    state_high = PastureState(
        paddock_id="P1",
        biomass_kg_ha=1000,
        ndvi_mean=0.4,
        ndvi_trend=-0.05,
        canopy_coverage=60.0,
        soil_moisture_proxy=0.2,
        days_since_graze=5,
        stocking_density_au_ha=3.0,
        season="summer"
    )
    grazing_rec = grazing_recommendation(state_high)
    print("\n--- HIGH PRESSURE GRAZING ---")
    print(f"Recommendation: {grazing_rec['recommendation']}")
    print(f"Confidence: {grazing_rec['confidence']}")
    print(f"KPI Impact: {grazing_rec['expected_kpi_impact']}")

    # Case 2: Healthy rest
    state_rest = PastureState(
        paddock_id="P2",
        biomass_kg_ha=2000,
        ndvi_mean=0.6,
        ndvi_trend=0.08,
        canopy_coverage=85.0,
        soil_moisture_proxy=0.5,
        days_since_graze=10,
        stocking_density_au_ha=1.0,
        season="spring"
    )
    grazing_rec_rest = grazing_recommendation(state_rest)
    print("\n--- HEALTHY RESTING ---")
    print(f"Recommendation: {grazing_rec_rest['recommendation']}")
    print(f"KPI Impact: {grazing_rec_rest['expected_kpi_impact']}")

    # Case 3: Harvest ready
    state_harvest = PastureState(
        paddock_id="P3",
        biomass_kg_ha=3600,
        ndvi_mean=0.75,
        ndvi_trend=0.01,
        canopy_coverage=95.0,
        soil_moisture_proxy=0.4,
        days_since_graze=50,
        stocking_density_au_ha=0.0,
        season="summer"
    )
    harvest_rec = harvest_recommendation(state_harvest)
    print("\n--- HARVEST READY ---")
    print(f"Recommendation: {harvest_rec['recommendation']}")
    print(f"KPI Impact: {harvest_rec['expected_kpi_impact']}")

if __name__ == "__main__":
    test_logic()
