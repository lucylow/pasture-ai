/**
 * Demo-mode simulation loop for pitch demos.
 * Cycles through scenarios (weather, time offset, counterfactual) on a timer
 * so the UI updates automatically without user interaction.
 */
import { useState, useEffect, useCallback } from "react"

export type DemoScenario = {
  timeOffsetDays: number
  weather: "sun" | "cloud" | "rain"
  counterfactualIndex: number
}

const DEMO_SCENARIOS: DemoScenario[] = [
  { timeOffsetDays: 0, weather: "sun", counterfactualIndex: 0 },
  { timeOffsetDays: 3, weather: "cloud", counterfactualIndex: 1 },
  { timeOffsetDays: 7, weather: "sun", counterfactualIndex: 1 },
  { timeOffsetDays: 14, weather: "rain", counterfactualIndex: 2 },
  { timeOffsetDays: 0, weather: "sun", counterfactualIndex: 0 },
]

type UseDemoSimulationLoopOptions = {
  /** Interval in ms between scenario changes. Default 8000 */
  intervalMs?: number
  /** Whether the loop is active. Default true */
  enabled?: boolean
}

type UseDemoSimulationLoopReturn = {
  scenario: DemoScenario
  scenarioIndex: number
  isRunning: boolean
  start: () => void
  stop: () => void
  setScenarioIndex: (idx: number) => void
}

export function useDemoSimulationLoop(
  options: UseDemoSimulationLoopOptions = {}
): UseDemoSimulationLoopReturn {
  const { intervalMs = 8000, enabled = true } = options
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const scenario = DEMO_SCENARIOS[scenarioIndex] ?? DEMO_SCENARIOS[0]

  useEffect(() => {
    if (!isRunning || !enabled) return
    const id = setInterval(() => {
      setScenarioIndex((i) => (i + 1) % DEMO_SCENARIOS.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [isRunning, enabled, intervalMs])

  const start = useCallback(() => setIsRunning(true), [])
  const stop = useCallback(() => setIsRunning(false), [])

  return {
    scenario,
    scenarioIndex,
    isRunning,
    start,
    stop,
    setScenarioIndex,
  }
}
