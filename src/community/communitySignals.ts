export function communitySignals(metrics: {
  adoptionRate: number
  avgBiomassChange: number
  avgCarbonChange: number
}) {
  return {
    health:
      metrics.adoptionRate > 0.6 &&
      metrics.avgBiomassChange > 0 &&
      metrics.avgCarbonChange > 0
        ? "thriving"
        : "developing",
    narrative:
      "Community practices are leading to measurable improvements in land health."
  }
}
