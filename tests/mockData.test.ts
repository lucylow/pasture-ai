import { mockFarms, mockPaddocks, mockKpis } from '@/lib/mockData';

describe('mockData', () => {
  it('has farms and paddocks', () => {
    expect(mockFarms.length).toBeGreaterThan(0);
    expect(mockPaddocks.length).toBeGreaterThan(0);
  });

  it('links paddocks to farms', () => {
    for (const p of mockPaddocks) {
      const farm = mockFarms.find((f) => f.id === p.farmId);
      expect(farm).toBeDefined();
    }
  });

  it('exposes KPIs for demo', () => {
    expect(mockKpis.length).toBeGreaterThanOrEqual(3);
  });
});
