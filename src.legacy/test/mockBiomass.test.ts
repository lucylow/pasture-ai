import { describe, it, expect } from 'vitest';
import { runMockBiomassPredictor } from '@/lib/mockBiomass';

describe('runMockBiomassPredictor', () => {
  it('returns deterministic result for same image', async () => {
    const img = 'AAAABBBBCCCC';
    const res1 = await runMockBiomassPredictor(img);
    const res2 = await runMockBiomassPredictor(img);
    expect(res1.dryBiomass_gm2).toBe(res2.dryBiomass_gm2);
  });

  it('returns fields with sensible ranges', async () => {
    const res = await runMockBiomassPredictor('XXXYYYZZZ');
    expect(res.dryBiomass_gm2).toBeGreaterThan(0);
    expect(res.dryBiomass_gm2).toBeLessThanOrEqual(800);
    expect(res.confidence).toBeGreaterThan(0);
    expect(res.confidence).toBeLessThanOrEqual(1);
    expect(typeof res.recommendation).toBe('string');
  });
});
