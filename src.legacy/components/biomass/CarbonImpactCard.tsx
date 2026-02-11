/**
 * Carbon impact summary card.
 */
import { carbonImpactEstimate } from "@/mock/carbonImpact"
import { biomassCopy } from "@/lib/image2biomassCopy"
import { Leaf } from "lucide-react"

export function CarbonImpactCard() {
  const c = carbonImpactEstimate
  const changePositive = c.netChange > 0

  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="h-4 w-4 text-[#3F6B3F]" />
        <h4 className="text-sm font-medium text-[#2C2C2A]">{biomassCopy.carbonTitle}</h4>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#2C2C2A]/70">{biomassCopy.carbonBaseline}</span>
          <span>{c.baselineCarbon_tCO2e_ha.toFixed(2)} tCO2e/ha</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#2C2C2A]/70">{biomassCopy.carbonPost}</span>
          <span>{c.postGrazingCarbon_tCO2e_ha.toFixed(2)} tCO2e/ha</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-[#2C2C2A]/10">
          <span className="text-[#2C2C2A]/70">{biomassCopy.carbonChange}</span>
          <span className={changePositive ? "text-[#3F6B3F]" : "text-red-600"}>
            {changePositive ? "+" : ""}
            {c.netChange.toFixed(2)} tCO2e/ha
          </span>
        </div>
      </div>
      <p className="text-[10px] text-[#2C2C2A]/50 mt-2">
        {biomassCopy.carbonMethodology} · {(c.confidence * 100).toFixed(0)}% confidence
      </p>
    </div>
  )
}
