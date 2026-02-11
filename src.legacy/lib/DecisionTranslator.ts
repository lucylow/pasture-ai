
export const translateAction = (action: string): string => {
  switch (action) {
    case 'GRAZE':
      return "Ready to graze";
    case 'WAIT':
      return "Wait a bit longer";
    case 'REST':
      return "Needs a rest";
    default:
      return action;
  }
};

export const translateReason = (reason: string): string => {
  const mapping: Record<string, string> = {
    "Biomass levels have reached optimal grazing threshold (2400kg/ha)": "There is plenty of grass ready for the animals.",
    "Weather forecast indicates favorable conditions for recovery": "The weather looks good for the grass to grow back.",
    "Plant maturity is at stage 3 (ideal for nutrient density)": "The grass is at its best quality right now.",
    "NDVI trend below seasonal baseline": "Grass is recovering slower than normal for this time of year",
    "Soil moisture is at critical levels": "The ground is getting too dry.",
    "Historical yield trends suggest resting": "Usually, this field does better if we give it a break now.",
  };

  return mapping[reason] || reason;
};

export const translateConfidence = (mean: number): string => {
  if (mean >= 0.8) return "High (seen this pattern many times)";
  if (mean >= 0.5) return "Medium (fairly sure)";
  return "Low (checking more data)";
};

export const getFarmerAdvice = (pastureId: string, action: string, suggestedInDays: number) => {
  if (action === 'GRAZE') {
    return suggestedInDays === 0 
      ? "Put the animals in today." 
      : `Plan to move animals here in about ${suggestedInDays} days.`;
  }
  if (action === 'REST') {
    return "Keep the animals off this field to let the grass recover.";
  }
  return "Keep an eye on this field, but don't move animals in yet.";
};
