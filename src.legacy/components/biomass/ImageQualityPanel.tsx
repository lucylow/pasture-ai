/**
 * Image quality + model confidence panel with farmer-friendly tooltips.
 */
import { imageQualityReport } from "@/mock/imageQuality"
import { biomassCopy } from "@/lib/image2biomassCopy"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function ImageQualityPanel() {
  const q = imageQualityReport

  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-medium text-[#2C2C2A] mb-3">
        {biomassCopy.imageQualityTitle}
      </h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            {biomassCopy.cloudCover}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-[#2C2C2A]/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[180px]">Lower is better — clouds block the view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span>{q.cloudCoverPercent}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{biomassCopy.illumination}</span>
          <span>{(q.illuminationScore * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{biomassCopy.sensorNoise}</span>
          <span>{(q.sensorNoiseScore * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{biomassCopy.alignmentQuality}</span>
          <span className="capitalize">{q.alignmentQuality}</span>
        </div>
        <div className="pt-2 mt-2 border-t border-[#2C2C2A]/10">
          <span className="text-[#2C2C2A]/60">{biomassCopy.modelConfidenceOverall}</span>
          <div className="mt-0.5 font-medium">{(q.modelConfidence.overall * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  )
}
