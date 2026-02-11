/**
 * Biomass API - offline-first: uses mock when API unavailable.
 * For Lovable Cloud: can call Supabase Edge Function when configured.
 */
import type { BiomassPrediction } from './mockBiomass';
import { runMockBiomassPredictor } from './mockBiomass';

export type BiomassMapResponse = {
  center: { latitude: number; longitude: number; zoom: number };
  geojson: GeoJSON.FeatureCollection;
};

/** Fetch biomass map data (pilot/static fallback). */
export async function fetchBiomassMap(
  pastureId: string
): Promise<BiomassMapResponse> {
  try {
    const res = await fetch('/pilotdata/biomass-map.json');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Offline or no pilot data
  }
  return {
    center: { latitude: -34.41, longitude: 150.88, zoom: 12 },
    geojson: { type: 'FeatureCollection' as const, features: [] },
  };
}

/** Post biomass prediction - uses mock for offline-first demo. */
export async function postBiomassPredict(
  imageBase64: string,
  meta?: Record<string, unknown>
): Promise<BiomassPrediction> {
  return runMockBiomassPredictor(imageBase64, meta);
}
