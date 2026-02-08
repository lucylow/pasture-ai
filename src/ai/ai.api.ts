import { BiomassPrediction } from "./ai.types";

// Mock implementation for demo purposes
export async function fetchBiomassPrediction(
  pastureId: string
): Promise<BiomassPrediction> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    pastureId,
    timestamp: new Date().toISOString(),
    biomassKgPerHa: 2450,
    growthRateKgPerHaPerDay: 45,
    confidence: {
      mean: 0.85,
      lower: 0.78,
      upper: 0.92,
    },
    spatialGrid: [
      { lat: -34.40, lng: 150.88, biomass: 1200, uncertainty: 0.1 },
      { lat: -34.41, lng: 150.89, biomass: 1800, uncertainty: 0.2 },
      { lat: -34.42, lng: 150.87, biomass: 2500, uncertainty: 0.05 },
      { lat: -34.40, lng: 150.89, biomass: 2100, uncertainty: 0.15 },
      { lat: -34.41, lng: 150.87, biomass: 2900, uncertainty: 0.1 },
    ],
    recommendation: {
      action: "GRAZE",
      suggestedInDays: 2,
      confidence: 0.88,
      reasoning: [
        "Biomass levels have reached optimal grazing threshold (2400kg/ha)",
        "Weather forecast indicates favorable conditions for recovery",
        "Plant maturity is at stage 3 (ideal for nutrient density)",
      ],
      expectedKpiImpact: {
        biomass_change_pct: "-5.0%",
        recovery_stability: "+0.12",
        soil_carbon_proxy_tco2: "+0.04",
        overgrazing_risk: "Low"
      }
    },
    explainability: {
      topDrivers: [
        { feature: "Recent Precipitation", impact: 0.45 },
        { feature: "Soil Moisture (SMAP)", impact: 0.30 },
        { feature: "Cumulative Degree Days", impact: 0.15 },
        { feature: "Historical Yield Trends", impact: 0.10 },
      ],
    },
  };
}
