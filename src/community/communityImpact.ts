export function communityImpact(stats: {
  farms: number
  hectares: number
  carbonSequestered: number
}) {
  return {
    headline: "Community-driven regenerative impact",
    metrics: {
      farmsParticipating: stats.farms,
      landUnderManagement_ha: stats.hectares,
      netCarbon_tCO2e: stats.carbonSequestered
    }
  }
}
