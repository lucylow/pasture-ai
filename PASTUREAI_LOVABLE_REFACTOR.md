# PastureAI Lovable Cloud Refactor — Manuscript

This document is a dense, code-heavy manuscript for fixing the PastureAI codebase to run error-free on Lovable.dev Cloud. Use it with Lovable, Cursor, or Claude to auto-refactor the repo.

---

## 1. Repo analysis: 22 likely errors and failure modes

1. **Supabase URL/key not wired through Lovable secrets** — Fixed via `lib/env.ts` and Lovable Secrets mapping.
2. **Server/client Supabase misuse** — Vite SPA: client-only Supabase in `lib/supabaseClient.ts`.
3. **Supabase auth fails under Lovable Cloud** — `useAuth` + `useLovableAuth` with Supabase when configured, mock otherwise.
4. **API route paths mismatched** — Vite has no API routes; all logic client-side or via Supabase.
5. **Edge function endpoints not adjusted** — Biomass prediction uses client-side mock.
6. **Mapbox token leakage** — Centralized in `lib/env.ts`, optional for MapLibre demotiles.
7. **React-Map-GL SSR errors** — Vite SPA: no SSR; MapLibre used with demotiles (no token required).
8. **TanStack Query infinite refetch** — Added `enabled: !!pastureId`, `staleTime`.
9. **Pilot datasets loader crashes** — Data in `public/pilotdata/`, fetched via `fetch()`.
10. **Offline/localStorage on server** — All `localStorage` guarded with `typeof window !== 'undefined'`.
11. **Tailwind purge misconfiguration** — Extended `content` to include `app/`, `components/`.
12. **Framer Motion + SSR** — Vite SPA; no SSR issues.
13. **Edge runtime Node APIs** — Not applicable (Vite SPA).
14. **Binary upload to Supabase storage** — Mock lovable storage; wire real when Supabase connected.
15. **Unscoped Supabase RLS** — SQL schema provided below.
16. **Sustainability APIs pointing to FastAPI** — Replaced with pilot/mock data and buildReportFromPilot.
17. **Language toggle not persisted** — `useLang` persists to localStorage.
18. **Offline-first mock not integrated** — `runMockBiomassPredictor` and `postBiomassPredict` used.
19. **Test suite paths** — Vitest configured for `src/**/*.{test,spec}.{ts,tsx}`.
20. **Lovable Cloud config** — `lovable.config.ts` updated with secrets.
21. **Bundle size** — MapLibre + dynamic patterns; pilot data lazy-loaded.
22. **Demo route not resilient** — `buildReportFromPilot` fallback; KPI defaults.

---

## 2. Key files created/modified

### `src/lib/env.ts`
```ts
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN ?? '',
  nodeEnv: import.meta.env.MODE || 'development',
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseUrl.startsWith('http'));
```

### `src/lib/supabaseClient.ts`
- `getBrowserSupabase()` — when Supabase configured
- `getSupabaseOrNull()` — returns null when not configured

### `src/lib/mockBiomass.ts`
- `runMockBiomassPredictor(imageBase64, meta)` — deterministic mock for offline demo

### `src/lib/biomassApi.ts`
- `fetchBiomassMap(pastureId)` — from `/pilotdata/biomass-map.json`
- `postBiomassPredict(imageBase64, meta)` — uses mock

### `src/hooks/useLocalHistory.ts`
- localStorage-backed prediction history (guarded for SSR)

### `src/hooks/usePilotData.ts`
- Fetches farms, paddocks, weekly from `public/pilotdata/`

### `src/hooks/useLang.ts`
- Persists EN/ES/Hindi to localStorage

### `src/lib/i18n.ts`
- `t(lang, key)` for translations

---

## 3. Supabase SQL schema (run in Supabase SQL Editor)

```sql
-- farms
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  coop_id TEXT,
  area_ha NUMERIC,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- paddocks
CREATE TABLE IF NOT EXISTS public.paddocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT,
  area_ha NUMERIC,
  slope TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- weekly_metrics
CREATE TABLE IF NOT EXISTS public.weekly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paddock_id UUID REFERENCES public.paddocks(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  dry_biomass_gm2 NUMERIC,
  overgrazing_events INTEGER DEFAULT 0,
  rest_days INTEGER DEFAULT 0,
  kpi_grazing_efficiency NUMERIC,
  kpi_overgrazing_reduction NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- sustainability_kpis
CREATE TABLE IF NOT EXISTS public.sustainability_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  grazing_efficiency_delta NUMERIC,
  overgrazing_reduction NUMERIC,
  biomass_stability_index NUMERIC,
  peer_validated_practice_adoption NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paddocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_farms" ON public.farms FOR SELECT USING (true);
CREATE POLICY "public_read_paddocks" ON public.paddocks FOR SELECT USING (true);
CREATE POLICY "public_read_weekly" ON public.weekly_metrics FOR SELECT USING (true);
CREATE POLICY "public_read_kpis" ON public.sustainability_kpis FOR SELECT USING (true);
```

---

## 4. Lovable configuration

In Lovable UI:
1. **Integrations → Supabase** — Connect project
2. **Secrets** — Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPBOX_TOKEN` (optional for MapLibre demotiles)

---

## 5. Deployment

```bash
npm install
npm run build
npx lovable deploy --cloud
```

Or use `scripts/deploy-lovable.sh`.

---

## 6. 90-second demo script

> On the left, I drop a pasture photo. The app runs a deterministic biomass estimator. Within a second, I get biomass (g/m²), a recommendation, and confidence. Every prediction is stored locally for offline use.
>
> On the right, the cooperative dashboard shows pilot data: grazing efficiency, overgrazing reduction, biomass stability, peer‑validated practices. All runs on Lovable Cloud with Supabase backend.

---

## 7. Test commands

```bash
npm run test
```

Tests: `mockBiomass.test.ts`, `i18n.test.ts`, `example.test.ts`.
