/**
 * Investor-grade biomass heatmap with uncertainty + carbon overlays.
 * Uses MapLibre + Image2Biomass mock tiles.
 */
import { useState } from "react"
import Map, { Source, Layer, Popup } from "react-map-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import maplibregl from "maplibre-gl"

import { image2BiomassSnapshot, confidenceTiles } from "@/mock"
import { biomassTilesToGeoJSON } from "@/utils/biomassToGeoJSON"
import { biomassFillPaint, biomassOutlinePaint } from "@/styles/biomassPaint"
import { uncertaintyFillPaint } from "@/styles/uncertaintyPaint"
import { carbonRecoveryPaint } from "@/styles/carbonPaint"
import { BiomassTooltip } from "./BiomassTooltip"
import type { MapGeoJSONFeature } from "react-map-gl"

const geojson = biomassTilesToGeoJSON(image2BiomassSnapshot.tiles, confidenceTiles)

type Image2BiomassMapProps = {
  showCarbonOverlay?: boolean
}

export function Image2BiomassMap({
  showCarbonOverlay = true,
}: Image2BiomassMapProps) {
  const [hover, setHover] = useState<MapGeoJSONFeature | null>(null)

  return (
    <Map
      mapLib={maplibregl}
      mapboxAccessToken={undefined}
      initialViewState={{
        longitude: 144.925,
        latitude: -37.805,
        zoom: 14,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      interactiveLayerIds={["biomass-fill"]}
      onMouseMove={(e) => {
        const feature = e.features?.[0]
        setHover(feature ?? null)
      }}
      onMouseLeave={() => setHover(null)}
    >
      <Source id="biomass" type="geojson" data={geojson}>
        {/* Biomass */}
        <Layer id="biomass-fill" type="fill" paint={biomassFillPaint} />

        {/* Uncertainty */}
        <Layer id="uncertainty-fill" type="fill" paint={uncertaintyFillPaint} />

        {/* Carbon / soil recovery */}
        {showCarbonOverlay && (
          <Layer
            id="carbon-recovery"
            type="fill"
            paint={carbonRecoveryPaint}
          />
        )}

        {/* Borders */}
        <Layer id="biomass-outline" type="line" paint={biomassOutlinePaint} />
      </Source>

      {hover && hover.geometry.type === "Polygon" && (
        <Popup
          longitude={(hover.geometry.coordinates[0][0] as [number, number])[0]}
          latitude={(hover.geometry.coordinates[0][0] as [number, number])[1]}
          closeButton={false}
          closeOnClick={false}
        >
          <BiomassTooltip feature={hover} />
        </Popup>
      )}
    </Map>
  )
}
