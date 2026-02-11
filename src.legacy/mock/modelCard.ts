/**
 * Model Card — Regulatory-friendly
 * This is exactly what regulators expect.
 */

export const modelCard = {
  name: "PastureAI Image2Biomass",
  intendedUse:
    "Estimate pasture biomass for grazing and land management decisions.",
  limitations: [
    "Reduced accuracy under snow cover",
    "Lower confidence on bare soil patches",
    "Requires calibration for new pasture species",
  ],
  ethicalConsiderations:
    "Model supports decision-making but does not automate grazing without human oversight.",
  updatePolicy: "Models retrained quarterly or upon detected drift.",
};
