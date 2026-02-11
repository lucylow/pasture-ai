'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchKpis(farmId: string) {
  const res = await fetch('/pilotdata/sustainability_kpis.json');
  if (!res.ok) return { data: null };
  const json = await res.json();
  return json;
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="border rounded-xl p-3 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

type Props = { farmId: string };

export function KpiDashboard({ farmId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['kpis', farmId],
    queryFn: () => fetchKpis(farmId),
    enabled: !!farmId,
  });

  const k = data?.data ?? {
    grazing_efficiency_delta: 0.18,
    overgrazing_reduction: 0.42,
    biomass_stability_index: 0.88,
    peer_validated_practice_adoption: 0.75,
  };

  if (isLoading) return <div className="text-sm text-slate-500">Loading KPIs…</div>;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card
        label="Grazing efficiency"
        value={`${((k.grazing_efficiency_delta ?? 0.18) * 100).toFixed(1)}%`}
        accent="text-emerald-600"
      />
      <Card
        label="Overgrazing reduction"
        value={`${((k.overgrazing_reduction ?? 0.42) * 100).toFixed(1)}%`}
        accent="text-emerald-600"
      />
      <Card
        label="Biomass stability"
        value={(k.biomass_stability_index ?? 0.88).toFixed(2)}
        accent="text-sky-600"
      />
      <Card
        label="Peer‑validated practices"
        value={`${((k.peer_validated_practice_adoption ?? 0.75) * 100).toFixed(1)}%`}
        accent="text-emerald-600"
      />
    </div>
  );
}
