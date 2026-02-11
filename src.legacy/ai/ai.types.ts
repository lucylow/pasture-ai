export type BiomassPrediction = {
  pastureId: string;

  timestamp: string;

  biomassKgPerHa: number;
  growthRateKgPerHaPerDay: number;

  confidence: {
    mean: number;
    lower: number;
    upper: number;
  };

  spatialGrid: {
    lat: number;
    lng: number;
    biomass: number;
    uncertainty: number;
  }[];

  recommendation: {
    action: "GRAZE" | "WAIT" | "REST" | "HARVEST";
    suggestedInDays: number;
    reasoning: string[];
    confidence?: number;
    expectedKpiImpact?: {
      biomass_change_pct?: string;
      recovery_stability?: string;
      soil_carbon_proxy_tco2?: string;
      overgrazing_risk?: string;
      yield_forecast_7d?: string;
      quality_index?: string;
    };
  };

  explainability: {
    topDrivers: {
      feature: string;
      impact: number;
    }[];
  };
};
