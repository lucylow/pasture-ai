/**
 * Deterministic mock biomass predictor for offline-first demo.
 * Works without GPU/model—uses image length as proxy for hackathon.
 */

export type BiomassPrediction = {
  dryBiomass_gm2: number;
  recommendation: string;
  confidence: number;
};

export async function runMockBiomassPredictor(
  imageBase64: string,
  meta?: Record<string, unknown>
): Promise<BiomassPrediction> {
  // Deterministic mock: use image length as proxy
  const baseScore = Math.min(800, (imageBase64.length % 400) + 200);
  const confidence = 0.78;
  const recommendation =
    baseScore > 600 ? 'Rest this paddock 5–7 days' : 'Safe to graze lightly now';

  return {
    dryBiomass_gm2: Math.round(baseScore),
    recommendation,
    confidence,
  };
}
