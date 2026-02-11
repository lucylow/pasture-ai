/**
 * Feature Attribution — Explainability
 * Frontend uses: Horizontal bar charts, "Why this number?" modals, trust indicators
 */

export const featureAttribution = {
  pastureId: "PASTURE_07",
  tileId: "TILE_02",
  contributions: [
    { feature: "NIR reflectance", weight: 0.34 },
    { feature: "Red Edge gradient", weight: 0.21 },
    { feature: "Texture variance", weight: 0.17 },
    { feature: "Historical growth trend", weight: 0.19 },
    { feature: "Soil moisture proxy", weight: 0.09 },
  ],
  explanationSummary:
    "Estimate driven primarily by vegetation vigor and historical growth patterns.",
};
