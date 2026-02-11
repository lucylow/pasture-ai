export const uncertaintyFillPaint = {
  "fill-color": "#2C2C2A",
  "fill-opacity": [
    "interpolate",
    ["linear"],
    ["get", "uncertaintyStd"],
    0.1, 0.05,
    0.3, 0.15,
    0.6, 0.3,
  ],
} as const
