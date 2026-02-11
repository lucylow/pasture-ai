/**
 * Temporal Model State — RNN / Growth curve
 * Drives: Growth curve labels, "Recovery speed" UI, grazing warnings
 */

export const temporalModelState = {
  pastureId: "PASTURE_07",
  modelType: "GRU",
  lookbackDays: 42,
  growthPhase: "peak_growth",
  learnedGrowthRate_t_ha_per_day: 0.041,
  seasonalityFactor: 0.88,
  stressIndicators: {
    droughtRisk: 0.12,
    overgrazingRisk: 0.28,
  },
};
