/**
 * AI Model Registry — What AI is running
 * Enables: Model version badges, "What model is this?" tooltips, compliance reporting
 */

export const aiModelRegistry = {
  image2Biomass: {
    modelId: "img2bio-v1.2.1",
    architecture: "CNN + Temporal GRU",
    trainedOn: {
      images: 128_000,
      farms: 412,
      regions: ["AU", "NZ", "EU", "US"],
      pastureTypes: ["ryegrass", "clover", "native", "mixed"],
    },
    lastRetrained: "2026-02-01",
    validation: {
      rmse_t_ha: 0.35,
      r2: 0.92,
      bias: -0.03,
    },
    status: "production",
  },
};
