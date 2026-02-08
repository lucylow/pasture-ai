export type GrazingPractice = {
  practiceId: string
  title: string
  description: string
  applicableWhen: {
    biomassRange: [number, number]
    rainfallCondition: "low" | "normal" | "high"
  }
  validatedByData: boolean
  outcomes: {
    avgBiomassGain: number
    avgRecoveryReductionDays: number
    avgCarbonDelta: number
  }
}

export const practiceExample: GrazingPractice = {
  practiceId: "PRACTICE_ROT_14D",
  title: "14-Day Rest Rotational Grazing",
  description:
    "Move stock every 3–4 days with a minimum 14-day rest period.",
  applicableWhen: {
    biomassRange: [2.0, 3.5],
    rainfallCondition: "normal"
  },
  validatedByData: true,
  outcomes: {
    avgBiomassGain: 0.42,
    avgRecoveryReductionDays: 6,
    avgCarbonDelta: 0.31
  }
}
