'use client';

import { useQuery } from '@tanstack/react-query';

export type PilotFarms = Array<{ id: string; name: string; coop_id?: string; area_ha?: number; country?: string }>;
export type PilotPaddocks = Array<{ id: string; farm_id: string; name: string; area_ha?: number; slope?: string }>;
export type PilotWeekly = Array<{
  paddock_id: string;
  week_start: string;
  dry_biomass_gm2: number;
  overgrazing_events?: number;
  rest_days?: number;
  kpi_grazing_efficiency?: number;
  kpi_overgrazing_reduction?: number;
}>;

export type PilotData = { farms: PilotFarms; paddocks: PilotPaddocks; weekly: PilotWeekly };

export function usePilotData() {
  return useQuery<PilotData>({
    queryKey: ['pilot-data'],
    queryFn: async () => {
      const [farmsRes, paddocksRes, weeklyRes] = await Promise.all([
        fetch('/pilotdata/pilotdata_farms.json'),
        fetch('/pilotdata/pilotdata_paddocks.json'),
        fetch('/pilotdata/pilotdata_weeklymetrics.json'),
      ]);
      if (!farmsRes.ok || !paddocksRes.ok || !weeklyRes.ok) {
        throw new Error('Failed to load pilot data');
      }
      const [farms, paddocks, weekly] = await Promise.all([
        farmsRes.json(),
        paddocksRes.json(),
        weeklyRes.json(),
      ]);
      return { farms, paddocks, weekly };
    },
    staleTime: Infinity,
  });
}
