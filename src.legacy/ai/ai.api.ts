import { BiomassPrediction } from "./ai.types";

// Offline-first mock: deterministic for demo, works without backend.
export async function fetchBiomassPrediction(
  pastureId: string
): Promise<BiomassPrediction> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const hash = pastureId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseBiomass = 2000 + (hash % 800);
  const growthRate = 35 + (hash % 25);

  return {
    pastureId,
    timestamp: new Date().toISOString(),
    biomassKgPerHa: baseBiomass,
    growthRateKgPerHaPerDay: growthRate,
    confidence: {
      mean: 0.85,
      lower: 0.78,
      upper: 0.92,
    },
    spatialGrid: [
      { lat: -34.40, lng: 150.88, biomass: baseBiomass * 0.5, uncertainty: 0.1 },
      { lat: -34.41, lng: 150.89, biomass: baseBiomass * 0.75, uncertainty: 0.2 },
      { lat: -34.42, lng: 150.87, biomass: baseBiomass, uncertainty: 0.05 },
      { lat: -34.40, lng: 150.89, biomass: baseBiomass * 0.9, uncertainty: 0.15 },
      { lat: -34.41, lng: 150.87, biomass: baseBiomass * 1.1, uncertainty: 0.1 },
    ],
    recommendation: {
      action: baseBiomass > 2400 ? "GRAZE" : "WAIT",
      suggestedInDays: baseBiomass > 2400 ? 2 : 7,
      confidence: 0.88,
      reasoning: [
        "Biomass levels have reached optimal grazing threshold",
        "Weather forecast indicates favorable conditions for recovery",
        "Plant maturity is at stage 3 (ideal for nutrient density)",
      ],
      expectedKpiImpact: {
        biomass_change_pct: "-5.0%",
        recovery_stability: "+0.12",
        soil_carbon_proxy_tco2: "+0.04",
        overgrazing_risk: "Low",
      },
    },
    explainability: {
      topDrivers: [
        { feature: "Recent Precipitation", impact: 0.45 },
        { feature: "Soil Moisture (SMAP)", impact: 0.3 },
        { feature: "Cumulative Degree Days", impact: 0.15 },
        { feature: "Historical Yield Trends", impact: 0.1 },
      ],
    },
  };
}
