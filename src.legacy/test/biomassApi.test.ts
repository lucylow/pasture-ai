import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postBiomassPredict } from '@/lib/biomassApi';

describe('postBiomassPredict', () => {
  it('returns a biomass prediction for valid input', async () => {
    const res = await postBiomassPredict('AAA', { filename: 'test.jpg' });
    expect(res.dryBiomass_gm2).toBeDefined();
    expect(res.recommendation).toBeDefined();
    expect(res.confidence).toBeDefined();
    expect(typeof res.recommendation).toBe('string');
    expect(res.confidence).toBeGreaterThan(0);
    expect(res.confidence).toBeLessThanOrEqual(1);
  });

  it('returns deterministic result for same image', async () => {
    const img = 'AAAABBBBCCCC';
    const res1 = await postBiomassPredict(img);
    const res2 = await postBiomassPredict(img);
    expect(res1.dryBiomass_gm2).toBe(res2.dryBiomass_gm2);
    expect(res1.recommendation).toBe(res2.recommendation);
  });
});
