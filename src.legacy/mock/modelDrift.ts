/**
 * Model Drift Monitoring — Live AI health
 * Enables: "AI health" badges, ops dashboards, automated retraining triggers
 */

export const modelDriftStatus = {
  modelId: "img2bio-v1.2.1",
  windowDays: 30,
  inputDrift: {
    spectralShift: 0.07,
    textureShift: 0.05,
    threshold: 0.15,
    status: "normal",
  },
  outputDrift: {
    biomassShift: 0.04,
    threshold: 0.12,
    status: "normal",
  },
  alert: null,
};
