export const biomassFillPaint = {
  "fill-color": [
    "interpolate",
    ["linear"],
    ["get", "biomass"],
    0, "#8A6B4A", // Soil Warm (low)
    1.5, "#90A583", // Meadow Soft
    3.5, "#3F6B3F", // Pasture Moss (high)
  ],
  "fill-opacity": 0.75,
} as const

export const biomassOutlinePaint = {
  "line-color": "#2C2C2A",
  "line-width": 0.5,
  "line-opacity": 0.4,
} as const
