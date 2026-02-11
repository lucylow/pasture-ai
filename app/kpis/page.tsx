import { sampleKpis } from '@/data/mock/kpis';
import Link from 'next/link';

export default function KPIs() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">KPIs & Metrics</h1>
        <p className="text-slate-600 mt-2">Key performance indicators for the PastureAI demo cooperative</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleKpis.metrics.map((m) => (
          <div key={m.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-sm text-slate-500 mb-1">{m.title}</div>
            <div className="text-2xl font-bold text-pasture-moss mt-1">{m.value}</div>
            <div className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div style={{ width: `${m.progress}%` }} className="h-2 bg-pasture-moss rounded-full transition-all duration-500" />
            </div>
            <div className="text-xs text-slate-400 mt-2">{m.progress}% target</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <h2 className="font-semibold text-slate-900 mb-4">Summary</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          These metrics are derived from a mock pilot with 12 regional farms. Grazing efficiency uplift and overgrazing reduction
          represent improvements when cooperative members adopt coordinated rest windows and PastureAI recommendations.
        </p>
        <Link href="/cooperative" className="inline-block mt-4 px-4 py-2 bg-pasture-moss text-white rounded-lg text-sm font-medium hover:bg-pasture-moss/90 transition-colors">
          View Cooperative Dashboard →
        </Link>
      </div>
    </section>
  );
}
