/**
 * Banner + controls for demo-mode simulation loop.
 * Use for pitch demos: auto-cycles through scenarios.
 */
import { useEffect } from "react"
import { useDemoSimulationLoop } from "@/hooks/useDemoSimulationLoop"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"

type DemoSimulationLoopBannerProps = {
  onScenarioChange?: (scenario: { timeOffsetDays: number; weather: "sun" | "cloud" | "rain"; counterfactualIndex: number }) => void
  className?: string
}

export function DemoSimulationLoopBanner({
  onScenarioChange,
  className = "",
}: DemoSimulationLoopBannerProps) {
  const { scenario, isRunning, start, stop } = useDemoSimulationLoop({
    intervalMs: 6000,
    enabled: true,
  })

  // Notify parent when scenario changes (so AIDemoSimulator, CounterfactualSlider can sync)
  useEffect(() => {
    onScenarioChange?.(scenario)
  }, [scenario, onScenarioChange])

  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm ${className}`}
    >
      <span className="text-amber-800">
        {isRunning ? "Demo loop running" : "Demo loop paused"}
      </span>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={isRunning ? "secondary" : "default"}
          onClick={isRunning ? stop : start}
        >
          {isRunning ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}
