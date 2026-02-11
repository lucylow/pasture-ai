import { BiomassSnapshot } from "../types/image2biomass"

export const image2BiomassSnapshot: BiomassSnapshot = {
  pastureId: "PASTURE_07",
  date: "2026-03-12",
  sourceImage: {
    type: "satellite",
    resolution_cm: 30,
    bands: ["RGB", "NIR", "RedEdge"],
    capturedAt: "2026-03-12T10:42:00Z"
  },
  tiles: [
    {
      tileId: "TILE_01",
      bounds: [144.92, -37.81, 144.925, -37.805],
      biomass_t_ha: 3.6,
      uncertainty: {
        lower: 3.2,
        upper: 4.0,
        std: 0.18
      },
      vegetationHealth: "high"
    },
    {
      tileId: "TILE_02",
      bounds: [144.925, -37.81, 144.93, -37.805],
      biomass_t_ha: 2.4,
      uncertainty: {
        lower: 2.0,
        upper: 2.9,
        std: 0.22
      },
      vegetationHealth: "medium"
    },
    {
      tileId: "TILE_03",
      bounds: [144.92, -37.805, 144.925, -37.8],
      biomass_t_ha: 1.6,
      uncertainty: {
        lower: 1.1,
        upper: 2.2,
        std: 0.35
      },
      vegetationHealth: "low"
    }
  ],
  summary: {
    meanBiomass: 2.53,
    minBiomass: 1.6,
    maxBiomass: 3.6,
    confidenceScore: 0.87
  }
}
