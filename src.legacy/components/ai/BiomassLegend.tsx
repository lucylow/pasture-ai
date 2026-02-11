/**
 * Biomass legend: earthy PastureAI palette (t/ha).
 * Opacity indicates uncertainty (low confidence → lower opacity).
 */
export function BiomassLegend() {
  const stops = [
    { color: "#8A6B4A", label: "Low" },
    { color: "#90A583", label: "Medium" },
    { color: "#3F6B3F", label: "High" },
  ];
  return (
    <div className="bg-[#F6F5F2] rounded-lg p-3 shadow-md text-xs border border-slate-200/60">
      <div className="font-semibold text-slate-700">Biomass (t/ha)</div>
      <div className="flex flex-wrap gap-3 mt-2">
        {stops.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className="rounded shrink-0"
              style={{ width: 20, height: 12, background: s.color }}
            />
            <span className="text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-slate-500">Opacity ~ uncertainty</div>
    </div>
  );
}
