export default function MetricBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white p-3 rounded shadow text-center">
      <div className="text-2xl font-bold text-pasture-moss">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
