/**
 * Uncertainty Decomposition — Regulator & auditor gold
 * Shows where uncertainty comes from (image vs model vs temporal)
 */

export const uncertaintyBreakdown = {
  totalStd: 0.22,
  components: [
    { source: "Image noise", contribution: 0.05 },
    { source: "Cloud contamination", contribution: 0.03 },
    { source: "Model variance", contribution: 0.09 },
    { source: "Temporal extrapolation", contribution: 0.05 },
  ],
  interpretation:
    "Uncertainty is primarily driven by model variance, not image quality.",
};
