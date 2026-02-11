'use client';

import Link from 'next/link';
import { communityPosts } from '@/data/mock/community';

export default function CommunityPage() {
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
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <span className="text-pasture-moss">📈</span>
              Community Insights
            </h2>
            <button
              type="button"
              className="px-4 py-2 bg-pasture-moss text-white rounded-lg text-sm font-medium hover:bg-pasture-moss/90"
            >
              New Observation
            </button>
          </div>

          <div className="space-y-4">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-pasture-moss/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-pasture-moss">
                      {post.author_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        {post.author_name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {post.type.replace('_', ' ')}
                      </span>
                      {post.peer_validated && (
                        <span className="text-green-600" title="Peer validated">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{post.timeAgo}</p>
                    <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-slate-500 text-sm">
                      <span>👍 {post.thumbs}</span>
                      <span>🌱 {post.plant}</span>
                      <span>💬 {post.comments}</span>
                      <button type="button" className="text-slate-500 hover:text-slate-700">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pasture-moss/5 border border-pasture-moss/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pasture-moss flex items-center justify-center text-white">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Community Agent</h3>
                <p className="text-xs text-slate-500">Synthesizing trends from 12 regional farms</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <span className="font-semibold">Regional Alert:</span> Low biomass recovery detected in Eastern paddocks. Recommend increasing rest period to 45 days.
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <span className="font-semibold">Peer Insight:</span> Farmers using holistic cell grazing are seeing 18% higher biomass stability during the dry spell.
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Generate Weekly Coop Briefing
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              🏆 Farmer Reputation
            </h3>
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-2xl font-bold text-slate-900">85.5</div>
                <div className="text-xs text-slate-500">Reputation Points</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Trust Score</div>
                <div className="text-lg font-bold text-green-600">92%</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs">
                <span>Next Level: Master Steward</span>
                <span>750 / 1000 XP</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-pasture-moss rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs px-2 py-1 bg-pasture-moss/10 text-pasture-moss rounded-full font-medium">Regen Pioneer</span>
              <span className="text-xs px-2 py-1 bg-pasture-moss/10 text-pasture-moss rounded-full font-medium">Top Observer</span>
              <span className="text-xs px-2 py-1 bg-pasture-moss/10 text-pasture-moss rounded-full font-medium">Carbon Saver</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              ⚡ Sustainability KPIs
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Grazing Efficiency</div>
                <div className="text-lg font-bold text-green-600">+18%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Rest Compliance</div>
                <div className="text-lg font-bold">95%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Biomass Stability</div>
                <div className="text-lg font-bold">0.88</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Soil Carbon</div>
                <div className="text-lg font-bold text-blue-600">2.4 t/ha</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
