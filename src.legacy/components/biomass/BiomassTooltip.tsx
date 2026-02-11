import type { MapGeoJSONFeature } from "react-map-gl"
import { cn } from "@/lib/utils"
import { biomassCopy } from "@/lib/image2biomassCopy"

type BiomassTooltipProps = {
  feature: MapGeoJSONFeature
}

const healthLabels: Record<string, string> = {
  low: biomassCopy.vegetationLow,
  medium: biomassCopy.vegetationMedium,
  high: biomassCopy.vegetationHigh,
}

export function BiomassTooltip({ feature }: BiomassTooltipProps) {
  const p = feature.properties as {
    biomass: number
    uncertaintyLow: number
    uncertaintyHigh: number
    uncertaintyStd: number
    health: string
    confidenceScore?: number
    confidenceReason?: string
    soilRecovery?: number
  }
  const conf = p.confidenceScore ?? 1 - p.uncertaintyStd
  const isLowConf = conf < 0.75
  const healthLabel = healthLabels[p.health] ?? p.health

  return (
    <div style={{ fontSize: 12 }} className="min-w-[180px] space-y-0.5">
      <div>
        <strong>{biomassCopy.biomassLabel}</strong>: {p.biomass.toFixed(2)} t/ha
      </div>
      <div>
        <strong>{biomassCopy.rangeLabel}</strong>: {p.uncertaintyLow.toFixed(1)} –{" "}
        {p.uncertaintyHigh.toFixed(1)}
      </div>
      <div>
        <strong
          className={cn(isLowConf && "text-amber-600")}
          title={biomassCopy.confidenceTooltip}
        >
          {biomassCopy.confidenceLabel}
        </strong>
        :{" "}
        <span className={cn(isLowConf && "font-medium text-amber-600")}>
          {conf.toFixed(2)}
        </span>
        {p.confidenceReason && (
          <div className="text-[10px] text-slate-500 mt-0.5">{p.confidenceReason}</div>
        )}
      </div>
      <div>
        <strong>{biomassCopy.vegetationLabel}</strong>: {healthLabel}
      </div>
      {p.soilRecovery != null && (
        <div>
          <strong>{biomassCopy.carbonTitle}</strong>: {(p.soilRecovery * 100).toFixed(0)}% recovery
        </div>
      )}
    </div>
  )
}
