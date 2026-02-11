/**
 * Model Confidence Map — Spatial AI output
 * Can be layered as: Confidence shading, warning icons, "Low confidence" callouts
 */

export const confidenceTiles = [
  {
    tileId: "TILE_01",
    confidenceScore: 0.91,
    reason: "High vegetation signal consistency",
  },
  {
    tileId: "TILE_02",
    confidenceScore: 0.84,
    reason: "Moderate temporal variance",
  },
  {
    tileId: "TILE_03",
    confidenceScore: 0.68,
    reason: "Sparse vegetation + soil exposure",
  },
];
