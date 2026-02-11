import { useMockAnalyses } from '../hooks/useMockAnalyses'

const healthColor: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-emerald-100 text-emerald-700',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800',
}

export function DashboardPage() {
  const { data, isLoading } = useMockAnalyses()
  const analyses = data ?? []

  const avgBiomass = analyses.length
    ? Math.round(analyses.reduce((s, a) => s + a.biomassKgHa, 0) / analyses.length)
    : 0

  const healthyPct = analyses.length
    ? Math.round(
        (analyses.filter(a => a.health === 'good' || a.health === 'excellent').length / analyses.length) * 100
      )
    : 0

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Paddocks" value={String(analyses.length)} />
        <StatCard label="Avg biomass" value={`${avgBiomass} kg/ha`} />
        <StatCard label="Healthy" value={`${healthyPct}%`} />
        <StatCard label="Countries" value={String(new Set(analyses.map(a => a.country)).size)} />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Farm</th>
              <th className="px-4 py-3 font-medium">Paddock</th>
              <th className="px-4 py-3 font-medium">Biomass</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Next action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {analyses.map(a => (
              <tr key={a.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3 font-medium">{a.farmName}</td>
                <td className="px-4 py-3">{a.paddockName}</td>
                <td className="px-4 py-3">{a.biomassKgHa.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${healthColor[a.health] ?? ''}`}>
                    {a.health}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{a.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
