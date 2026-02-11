-- PastureAI / Sustainability pilot schema for Supabase
-- Run this in Supabase SQL Editor after connecting your project.
-- Lovable: configure via Integrations → Supabase.

-- pilotdata_farms
create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  coop_id text,
  area_ha numeric,
  country text,
  created_at timestamptz default now()
);

-- paddocks
create table if not exists public.paddocks (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  name text,
  area_ha numeric,
  slope text,
  created_at timestamptz default now()
);

-- weekly metrics
create table if not exists public.weekly_metrics (
  id uuid primary key default gen_random_uuid(),
  paddock_id uuid references public.paddocks(id) on delete cascade,
  week_start date not null,
  dry_biomass_gm2 numeric,
  overgrazing_events integer default 0,
  rest_days integer default 0,
  kpi_grazing_efficiency numeric,
  kpi_overgrazing_reduction numeric,
  created_at timestamptz default now()
);

-- simple social impact metrics
create table if not exists public.sustainability_kpis (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  period_start date,
  period_end date,
  grazing_efficiency_delta numeric,
  overgrazing_reduction numeric,
  biomass_stability_index numeric,
  peer_validated_practice_adoption numeric,
  created_at timestamptz default now()
);

-- RLS policies for public pilot view
alter table public.farms enable row level security;
alter table public.paddocks enable row level security;
alter table public.weekly_metrics enable row level security;
alter table public.sustainability_kpis enable row level security;

create policy "public_read_pilot" on public.farms
  for select using (true);

create policy "public_read_paddocks" on public.paddocks
  for select using (true);

create policy "public_read_weekly" on public.weekly_metrics
  for select using (true);

create policy "public_read_kpis" on public.sustainability_kpis
  for select using (true);
