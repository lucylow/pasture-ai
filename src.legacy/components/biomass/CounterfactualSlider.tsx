/**
 * "What if we wait?" counterfactual slider.
 */
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { counterfactualScenarios } from "@/mock/counterfactual"
import { biomassCopy } from "@/lib/image2biomassCopy"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

const labels: Record<number, string> = {
  0: biomassCopy.scenarioNow,
  7: biomassCopy.scenarioWait7,
  14: biomassCopy.scenarioWait14,
}

export function CounterfactualSlider() {
  const [idx, setIdx] = useState(0)
  const scenario = counterfactualScenarios[idx]

  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-[#2C2C2A]">
          {biomassCopy.counterfactualTitle}
        </h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-[#2C2C2A]/50 hover:text-[#2C2C2A]"
                aria-label="Info"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px] text-xs">{biomassCopy.counterfactualSubtitle}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Slider
        value={[idx]}
        onValueChange={([v]) => setIdx(v)}
        min={0}
        max={counterfactualScenarios.length - 1}
        step={1}
        className="mt-2"
      />
      <p className="text-[10px] text-[#2C2C2A]/50 mt-1">
        {biomassCopy.delayDaysLabel}: {scenario.delayDays} days
      </p>
      <div className="mt-3 p-2 rounded-lg bg-[#2C2C2A]/5 text-sm">
        <div className="font-medium text-[#2C2C2A]">
          {scenario.biomass_t_ha.toFixed(2)} t/ha
        </div>
        <div className="text-xs text-[#2C2C2A]/60">
          Range: {scenario.uncertainty[0].toFixed(1)} – {scenario.uncertainty[1].toFixed(1)}
        </div>
      </div>
    </div>
  )
}
