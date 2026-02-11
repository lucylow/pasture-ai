import { useMockAnalyses } from '../hooks/useMockAnalyses'

export function DashboardPage() {
  const { data, isLoading } = useMockAnalyses()
  const analyses = data ?? []
  const avgBiomass = analyses.length === 0 ? 0 : Math.round(analyses.reduce((s, a) => s + a.biomassKgHa, 0) / analyses.length)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard (mock)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total analyses" value={String(analyses.length)} />
        <Card label="Avg biomass" value={`${avgBiomass} kg/ha`} />
        <Card label="Good+ health" value={`${analyses.filter(a => a.health === 'good' || a.health === 'excellent').length}`} />
        <Card label="Countries" value={String(new Set(analyses.map(a => a.country)).size)} />
      </div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Farm</th>
              <th className="px-4 py-3">Paddock</th>
              <th className="px-4 py-3">Biomass</th>
              <th className="px-4 py-3">Health</th>
              <th className="px-4 py-3">Next action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>}
            {!isLoading && analyses.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3">{a.farmName}</td>
                <td className="px-4 py-3">{a.paddockName}</td>
                <td className="px-4 py-3">{a.biomassKgHa}</td>
                <td className="px-4 py-3 capitalize">{a.health}</td>
                <td className="px-4 py-3">{a.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
