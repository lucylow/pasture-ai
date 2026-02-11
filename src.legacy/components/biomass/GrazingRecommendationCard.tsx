/**
 * Grazing recommendation with rationale and farmer-friendly copy.
 */
import { grazingRecommendation } from "@/mock/grazingRecommendation"
import { biomassCopy } from "@/lib/image2biomassCopy"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const actionLabels: Record<string, string> = {
  graze_partial: biomassCopy.grazePartial,
  graze_full: biomassCopy.grazeFull,
  wait: biomassCopy.grazeWait,
}

export function GrazingRecommendationCard() {
  const rec = grazingRecommendation
  const actionLabel = actionLabels[rec.recommendedAction] ?? rec.recommendedAction

  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-medium text-[#2C2C2A] mb-3">Recommendation</h4>
      <p className="text-base font-semibold text-[#3F6B3F] mb-3">{actionLabel}</p>
      <div className="space-y-2 text-xs text-[#2C2C2A]/80">
        <div className="flex justify-between">
          <span>{biomassCopy.grazeAreaLabel}</span>
          <span>{rec.grazeAreaPercent}%</span>
        </div>
        <div className="flex justify-between">
          <span>{biomassCopy.grazeTonnesLabel}</span>
          <span>{rec.grazeTonnes} t</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{biomassCopy.recoveryLabel}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1">
                  {rec.expectedRecoveryDays} days
                  <Info className="h-3 w-3 text-[#2C2C2A]/50" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[220px] text-xs">{biomassCopy.recoveryTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[#2C2C2A]/10">
        <p className="text-[10px] font-medium text-[#2C2C2A]/60 uppercase tracking-wider mb-1">
          {biomassCopy.rationaleTitle}
        </p>
        <ul className="text-xs text-[#2C2C2A]/80 space-y-1">
          {rec.rationale.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      </div>
      <p className="text-[10px] text-[#2C2C2A]/50 mt-2">
        Confidence: {(rec.confidence * 100).toFixed(0)}%
      </p>
    </div>
  )
}
