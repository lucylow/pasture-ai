import type { BiomassTile } from "../types/image2biomass"

type ConfidenceTile = { tileId: string; confidenceScore: number; reason?: string }

export function biomassTilesToGeoJSON(
  tiles: BiomassTile[],
  confidenceTiles?: ConfidenceTile[]
) {
  const confMap = new Map(
    confidenceTiles?.map((c) => [c.tileId, c]) ?? []
  )
  return {
    type: "FeatureCollection" as const,
    features: tiles.map((tile) => {
      const conf = confMap.get(tile.tileId)
      return {
        type: "Feature" as const,
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [tile.bounds[0], tile.bounds[1]],
              [tile.bounds[2], tile.bounds[1]],
              [tile.bounds[2], tile.bounds[3]],
              [tile.bounds[0], tile.bounds[3]],
              [tile.bounds[0], tile.bounds[1]],
            ],
          ],
        },
        properties: {
          tileId: tile.tileId,
          biomass: tile.biomass_t_ha,
          uncertaintyLow: tile.uncertainty.lower,
          uncertaintyHigh: tile.uncertainty.upper,
          uncertaintyStd: tile.uncertainty.std,
          health: tile.vegetationHealth,
          confidenceScore: conf?.confidenceScore ?? 1 - tile.uncertainty.std,
          confidenceReason: conf?.reason,
          // Soil recovery / carbon: high veg → high recovery
          soilRecovery:
            tile.vegetationHealth === "high"
              ? 0.92
              : tile.vegetationHealth === "medium"
                ? 0.72
                : 0.45,
        },
      }
    }),
  }
}
