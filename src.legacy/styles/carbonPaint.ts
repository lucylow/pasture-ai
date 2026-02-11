/**
 * Carbon / soil recovery overlay.
 * Higher soilRecovery = healthier soil = lighter tint (less shading).
 */
export const carbonRecoveryPaint = {
  "fill-color": "#1a3d2e",
  "fill-opacity": [
    "interpolate",
    ["linear"],
    ["get", "soilRecovery"],
    0.3, 0.25,
    0.6, 0.12,
    0.9, 0.04,
  ],
} as const
