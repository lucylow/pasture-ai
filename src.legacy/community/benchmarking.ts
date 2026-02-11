type BenchmarkInput = {
  biomass_t_ha: number
  recoveryDays: number
  carbonFlux: number
}

export function anonymizedBenchmark(
  user: BenchmarkInput,
  peerGroup: BenchmarkInput[]
) {
  const avg = (key: keyof BenchmarkInput) =>
    peerGroup.reduce((s, p) => s + p[key], 0) / peerGroup.length

  return {
    comparison: {
      biomassVsPeers_pct:
        ((user.biomass_t_ha - avg("biomass_t_ha")) / avg("biomass_t_ha")) * 100,
      recoveryVsPeers_days:
        user.recoveryDays - avg("recoveryDays"),
      carbonVsPeers_pct:
        ((user.carbonFlux - avg("carbonFlux")) / avg("carbonFlux")) * 100
    },
    peerCount: peerGroup.length,
    anonymityGuaranteed: true
  }
}
