'use client';

import { useState, useMemo } from 'react';

const ecoTips = [
  { season: 'Year-round', difficulty: 'Moderate', title: 'Implement Rotational Grazing', desc: 'Divide your pasture into smaller paddocks and rotate livestock regularly. This allows grass to recover, prevents overgrazing, and improves soil health through even manure distribution.' },
  { season: 'Year-round', difficulty: 'Moderate', title: 'Optimize Water Distribution', desc: 'Strategic placement of water sources encourages even grazing distribution and prevents congregation areas that lead to soil compaction and bare patches.' },
  { season: 'Fall', difficulty: 'Easy', title: 'Regular Soil Testing & Amendment', desc: 'Test soil annually to understand nutrient levels and pH. Targeted amendments based on test results are more cost-effective and environmentally friendly than blanket applications.' },
  { season: 'Spring', difficulty: 'Moderate', title: 'Plant Diverse Grass & Legume Mix', desc: 'Multi-species pastures are more resilient to drought, disease, and pests. Legumes fix nitrogen naturally, reducing fertilizer needs while improving forage quality.' },
  { season: 'Spring', difficulty: 'Advanced', title: 'Establish Shelter Belts & Trees', desc: 'Strategic tree planting provides windbreaks, shade for livestock, wildlife habitat, and carbon sequestration while reducing erosion and improving water retention.' },
  { season: 'Spring', difficulty: 'Easy', title: 'Support Beneficial Insects', desc: 'Pollinators and pest predators improve pasture ecosystem health. Creating habitat for beneficial insects reduces pest pressure naturally and supports biodiversity.' },
  { season: 'Year-round', difficulty: 'Easy', title: 'Implement Strategic Rest Periods', desc: 'Allowing pastures adequate rest between grazing events enables full root recovery, builds soil organic matter, and dramatically increases long-term productivity.' },
  { season: 'Fall', difficulty: 'Moderate', title: 'Use Cover Crops & Green Manure', desc: 'Planting cover crops during fallow periods prevents erosion, adds organic matter, and can provide additional grazing while improving soil health for the next growing season.' },
];

const seasons = ['All Seasons', 'Year-round', 'Spring', 'Summer', 'Fall', 'Winter'];
const difficulties = ['All Levels', 'Easy', 'Moderate', 'Advanced'];

export default function EcoTipsSection() {
  const [season, setSeason] = useState('All Seasons');
  const [difficulty, setDifficulty] = useState('All Levels');

  const filtered = useMemo(() => {
    return ecoTips.filter((tip) => {
      const matchSeason = season === 'All Seasons' || tip.season === season;
      const matchDifficulty = difficulty === 'All Levels' || tip.difficulty === difficulty;
      return matchSeason && matchDifficulty;
    });
  }, [season, difficulty]);

  return (
    <section id="eco-tips" className="scroll-mt-24">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Ecological Transformation Tips
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Practical, science-backed strategies to improve your pasture health, increase
            productivity, and build a more sustainable farming operation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '30-50%', label: 'Productivity increase with rotational grazing' },
            { value: '200 lbs', label: 'Nitrogen fixed per acre by legumes annually' },
            { value: '5 tons', label: 'CO2 sequestered per acre with silvopasture' },
            { value: '6 feet', label: 'Deep root growth with proper rest periods' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-pasture-moss-50 border border-pasture-moss/20 transition-all hover:border-pasture-moss/40 hover:shadow-sm"
            >
              <div className="text-2xl font-bold text-pasture-moss">{stat.value}</div>
              <div className="text-xs text-slate-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="season-filter" className="sr-only">Filter by season</label>
            <select
              id="season-filter"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-pasture-moss focus:ring-2 focus:ring-pasture-moss/20"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="difficulty-filter" className="sr-only">Filter by difficulty</label>
            <select
              id="difficulty-filter"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-pasture-moss focus:ring-2 focus:ring-pasture-moss/20"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-pasture-meadow/40 hover:-translate-y-0.5"
            >
              <div className="flex gap-2 text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-100">{tip.season}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100">{tip.difficulty}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{tip.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-8">No tips match the selected filters.</p>
        )}

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            Ready to Transform Your Pastures?
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto">
            Use PastureAI to monitor your progress and get personalized recommendations based on
            your specific pasture conditions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/demo"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-pasture-moss text-white font-semibold hover:bg-pasture-moss/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Try the Demo App
            </a>
            <a
              href="#live-demo"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-pasture-moss text-pasture-moss font-semibold hover:bg-pasture-moss/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Analyze Your Pasture
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
