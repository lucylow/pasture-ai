/**
 * Demo-mode AI simulator — time + weather sliders.
 * Adjusts displayed confidence/uncertainty for demo purposes.
 */
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sun, Cloud, CloudRain } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  image2BiomassSnapshot,
  confidenceTiles,
} from "@/mock"

export type SimulatorState = {
  timeOffsetDays: number
  weather: "sun" | "cloud" | "rain"
}

const DEFAULT: SimulatorState = {
  timeOffsetDays: 0,
  weather: "sun",
}

/**
 * Derive simulated confidence from weather and time.
 * Rain + old data => lower confidence.
 */
export function useSimulatedValues(state: SimulatorState) {
  const weatherFactor =
    state.weather === "sun" ? 1 : state.weather === "cloud" ? 0.9 : 0.75
  const timeDecay = Math.max(0.6, 1 - state.timeOffsetDays * 0.02)
  const factor = weatherFactor * timeDecay

  const meanConfidence =
    (confidenceTiles.reduce((a, t) => a + t.confidenceScore, 0) /
      confidenceTiles.length) *
    factor

  const meanBiomass =
    image2BiomassSnapshot.summary.meanBiomass *
    (state.weather === "rain" ? 0.95 : state.weather === "cloud" ? 0.98 : 1)

  return {
    meanConfidence: Math.min(0.99, Math.max(0.5, meanConfidence)),
    meanBiomass,
  }
}

export function AIDemoSimulator({
  state,
  onStateChange,
  className,
}: {
  state: SimulatorState
  onStateChange: (s: SimulatorState) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm",
        className
      )}
    >
      <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider mb-3">
        Demo Simulator
      </h4>
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-[#2C2C2A]/80">
            Time offset (days since image)
          </Label>
          <Slider
            value={[state.timeOffsetDays]}
            onValueChange={([v]) =>
              onStateChange({ ...state, timeOffsetDays: v })
            }
            min={0}
            max={21}
            step={1}
            className="mt-1"
          />
          <p className="text-[10px] text-[#2C2C2A]/50 mt-0.5">
            {state.timeOffsetDays} days
          </p>
        </div>
        <div>
          <Label className="text-xs text-[#2C2C2A]/80 block mb-2">
            Weather
          </Label>
          <div className="flex gap-2">
            {(
              [
                { id: "sun" as const, icon: Sun, label: "Clear" },
                { id: "cloud" as const, icon: Cloud, label: "Cloudy" },
                { id: "rain" as const, icon: CloudRain, label: "Rain" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onStateChange({ ...state, weather: id })}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors",
                  state.weather === id
                    ? "border-[#2C2C2A] bg-[#2C2C2A]/5 text-[#2C2C2A]"
                    : "border-[#2C2C2A]/20 text-[#2C2C2A]/60 hover:border-[#2C2C2A]/40"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
