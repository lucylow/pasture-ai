/**
 * Multi-Model Ensemble Logic
 * Shows: AI robustness, redundancy, non-black-box design
 */

export const ensembleDecision = {
  pastureId: "PASTURE_07",
  models: [
    { name: "Satellite CNN", weight: 0.45 },
    { name: "Drone Vision Model", weight: 0.3 },
    { name: "Temporal Growth Model", weight: 0.25 },
  ],
  ensembleMethod: "weighted_mean",
  stabilityScore: 0.89,
};
