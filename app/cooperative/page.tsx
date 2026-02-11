'use client';

import Link from 'next/link';
import { sampleCoop } from '@/data/mock/coop';

// Mock spatial grid for cooperative biomass map
const spatialGrid = [
  { biomass: 1200, uncertainty: 0.3 },
  { biomass: 2100, uncertainty: 0.2 },
  { biomass: 2800, uncertainty: 0.15 },
  { biomass: 1800, uncertainty: 0.25 },
  { biomass: 2400, uncertainty: 0.18 },
  { biomass: 1600, uncertainty: 0.22 },
  { biomass: 3200, uncertainty: 0.1 },
  { biomass: 900, uncertainty: 0.35 },
  { biomass: 2600, uncertainty: 0.12 },
];

export default function CooperativePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">PastureAI Social</h1>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pasture-moss text-white rounded-lg font-medium text-sm hover:bg-pasture-moss/90 transition-colors"
        >
          Farmer Mode
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Spatial Biomass Analysis</h2>
              <p className="text-sm text-slate-500 mt-1">Real-time model inference based on satellite & sensor fusion</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <span>↑</span>
                <span>+45 kg/ha/day</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">Estimated Growth Rate</p>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full h-full">
                {spatialGrid.map((point, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{
                      left: `${15 + (i * 10)}%`,
                      top: `${25 + ((i % 3) * 20)}%`,
                      backgroundColor: point.biomass > 2500 ? '#3F6B3F' : point.biomass > 1500 ? '#90A583' : '#8A6B4A',
                      opacity: 1 - point.uncertainty * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg text-[10px] text-slate-600 shadow-sm border border-slate-200 pointer-events-none">
              <p className="font-bold mb-2 uppercase tracking-tight text-slate-800">Biomass Legend (kg DM/ha)</p>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#8A6B4A]" />
                  <span>0</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#90A583]" />
                  <span>1500</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#3F6B3F]" />
                  <span>3000+</span>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white border border-white/20">
              Live Model: PastureV4-Base
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
            <span className="text-slate-400 shrink-0 mt-0.5">ℹ</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Spatial grid data is generated using a transformer-based vision model fine-tuned on regional pasture characteristics.
              Cooperative view aggregates data across {sampleCoop.members.length} member farms.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Cooperative Dashboard</h3>
            <p className="text-sm text-slate-600 mb-4">{sampleCoop.name} — {sampleCoop.members.length} farms</p>
            <div className="grid gap-4">
              {sampleCoop.members.map((m) => (
                <div key={m.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.region}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pasture-moss">{m.latestSnapshot.biomass} g/m²</div>
                      <div className="text-xs text-slate-500">CI: {m.latestSnapshot.ciLow}-{m.latestSnapshot.ciHigh}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/demo?farm=${m.id}`} className="text-xs px-3 py-1.5 bg-slate-100 rounded hover:bg-slate-200 font-medium">View</Link>
                    <button type="button" className="text-xs px-3 py-1.5 bg-slate-100 rounded hover:bg-slate-200 font-medium">Export</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">Coop Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Members</span>
                <span className="font-bold">{sampleCoop.members.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Sustainability</span>
                <span className="font-bold text-green-600">4.8/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Carbon Sequestered</span>
                <span className="font-bold text-blue-600">450 tCO2e</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            Generate Weekly Coop Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
