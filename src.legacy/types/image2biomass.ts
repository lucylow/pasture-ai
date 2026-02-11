export type BiomassTile = {
  tileId: string
  bounds: [number, number, number, number] // [minLng, minLat, maxLng, maxLat]
  biomass_t_ha: number
  uncertainty: {
    lower: number
    upper: number
    std: number
  }
  vegetationHealth: "low" | "medium" | "high"
}

export type BiomassSnapshot = {
  pastureId: string
  date: string
  sourceImage: {
    type: "satellite" | "drone"
    resolution_cm: number
    bands: string[]
    capturedAt: string
  }
  tiles: BiomassTile[]
  summary: {
    meanBiomass: number
    minBiomass: number
    maxBiomass: number
    confidenceScore: number
  }
}
