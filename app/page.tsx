import Link from 'next/link';

function FeatureStep({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="space-y-4 text-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-pasture-moss/10 flex items-center justify-center">
        <span className="text-2xl font-bold text-pasture-moss">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pasture-moss/10 text-pasture-moss text-sm font-medium">
                Demo · Lovable.dev Frontend
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                PastureAI Demo
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                A multi-page frontend demo for sustainable grazing intelligence. Rich mock data,
                no backend required, Lovable-ready.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/demo" className="px-8 py-3 bg-pasture-moss text-white rounded-xl font-semibold shadow-lg hover:bg-pasture-moss/90 transition-colors">
                  Try Demo →
                </Link>
                <Link href="/cooperative" className="px-8 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:border-pasture-moss hover:text-pasture-moss transition-colors">
                  View Cooperative
                </Link>
                <Link href="/paddocks" className="px-8 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:border-pasture-moss hover:text-pasture-moss transition-colors">
                  My Paddocks
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-pasture-meadow/50 to-pasture-soil/30 border-4 border-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3F6B3F40,transparent),radial-gradient(circle_at_70%_80%,#90A58330,transparent)]" />
                <div className="absolute top-6 right-6 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm">
                  Mock pasture view
                </div>
                <div className="absolute bottom-6 left-6 bg-white/95 rounded-2xl p-4 shadow-lg w-64">
                  <div className="text-xs text-slate-500 mb-1">Demo biomass snapshot</div>
                  <div className="text-2xl font-bold text-pasture-moss">820 g/m²</div>
                  <div className="text-xs text-slate-500 mt-1">Rest 5–7 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 items-baseline">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-pasture-moss">+18%</div>
              <div className="text-sm text-slate-600 mt-1">Grazing efficiency (mock pilot)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-pasture-moss">−42%</div>
              <div className="text-sm text-slate-600 mt-1">Overgrazing reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-pasture-moss">12</div>
              <div className="text-sm text-slate-600 mt-1">Farms in demo co-op</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-pasture-moss">0.86</div>
              <div className="text-sm text-slate-600 mt-1">Biomass stability index</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">How the demo works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureStep number="1" title="Photo" desc="Farmer or drone captures pasture image." />
            <FeatureStep number="2" title="Estimate" desc="Deterministic mock model returns biomass + recommendation." />
            <FeatureStep number="3" title="Action" desc="Clear recommendation: Rest 5–7 days or Graze lightly." />
            <FeatureStep number="4" title="Track" desc="Simple tracking & exportable reports (GeoTIFF/CSV/JSON)." />
          </div>
        </div>
      </section>
    </>
  );
}
