export const mockBiomassPrediction = {
  pastureId: "P3",
  timestamp: "2026-02-05T06:45:00Z",
  biomass: 4.1,
  confidence: 0.93,
  modelVersion: "biomass-v3.2",
  forecast: [
    {
      date: "2026-02-06",
      predictedBiomass: 4.15,
      confidenceLower: 3.9,
      confidenceUpper: 4.4,
    },
    {
      date: "2026-02-08",
      predictedBiomass: 4.25,
      confidenceLower: 3.95,
      confidenceUpper: 4.6,
    },
    {
      date: "2026-02-12",
      predictedBiomass: 4.4,
      confidenceLower: 4.0,
      confidenceUpper: 4.8,
    },
    {
      date: "2026-02-16",
      predictedBiomass: 4.55,
      confidenceLower: 4.1,
      confidenceUpper: 5.0,
    },
  ],
};
