/**
 * Optimization Engine — AI → Decision
 * Frontend uses: Plan comparison cards, sliders, decision justification
 */

export const optimizationEngineState = {
  objective: "maximize_biomass_utilization",
  constraints: {
    minResidualBiomass_t_ha: 1.5,
    maxGrazeDays: 5,
    laborHours: 12,
    waterAvailability: "adequate",
  },
  evaluatedPlans: 18,
  selectedPlan: {
    grazeAreaPercent: 42,
    grazeStart: "2026-03-14",
    grazeDurationDays: 3,
    expectedOutcome: {
      utilizationEfficiency: 0.78,
      recoveryTimeDays: 26,
    },
  },
};
