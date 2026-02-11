export const mockScenarioResults = {
  scenario: {
    startInDays: 3,
    durationDays: 6,
    stockingRate: 1.1,
  },
  outcomes: {
    postGrazingBiomass: 2.3,
    recoveryDays: 34,
    soilImpact: "Moderate",
    carbonEffect: -0.04,
  },
};

export const mockScenarioDelayed = {
  scenario: {
    startInDays: 10,
    durationDays: 5,
    stockingRate: 1.0,
  },
  outcomes: {
    postGrazingBiomass: 2.8,
    recoveryDays: 26,
    soilImpact: "Low",
    carbonEffect: +0.06,
  },
};
