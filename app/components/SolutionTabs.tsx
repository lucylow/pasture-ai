'use client';

import { useState } from 'react';

const tabs = [
  { id: 'image', label: 'Image Analysis', desc: 'Smartphone or drone imagery analyzed for biomass density in real time. Upload a photo and get instant estimates.' },
  { id: 'livestock', label: 'Livestock AI', desc: 'On-device models provide grazing recommendations based on pasture condition, rest periods, and herd size.' },
  { id: 'offline', label: 'Offline Mode', desc: 'Full functionality without connectivity—analyze in the field, sync when you return. No subscription required.' },
  { id: 'coop', label: 'Community', desc: 'Cooperative dashboards and KPI roll-ups show how individual decisions impact the whole co-op. Mock dashboards available.' },
  { id: 'sustainability', label: 'Sustainability', desc: 'Carbon impact tracking and rest period optimization help you meet sustainability targets and improve soil health.' },
];

export default function SolutionTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              active === tab.id
                ? 'bg-pasture-moss text-white shadow-md ring-2 ring-pasture-moss/30'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-pasture-moss hover:bg-pasture-moss-50 hover:text-pasture-moss'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        key={active}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        <h3 className="text-lg font-semibold text-slate-900">{activeTab.label}</h3>
        <p className="mt-2 text-slate-600">{activeTab.desc}</p>
      </div>
    </div>
  );
}
