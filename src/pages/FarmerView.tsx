import React from 'react';
import { useBiomassAI } from "../hooks/useBiomassAI";
import { FarmerDecisionCard } from "../components/ai/FarmerDecisionCard";
import { DailyTasksView } from "../components/ai/DailyTasksView";
import { OfflineBanner } from "../components/ai/OfflineBanner";
import { Skeleton } from "../components/ui/skeleton";
import { Tractor, ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";

const FarmerView = () => {
  // In a real app, we'd fetch multiple pastures. For demo, we'll use a few.
  const { data: p1, isLoading: l1 } = useBiomassAI("North Field");
  const { data: p2, isLoading: l2 } = useBiomassAI("South Pasture");
  const { data: p3, isLoading: l3 } = useBiomassAI("Hill Side");

  const isLoading = l1 || l2 || l3;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <OfflineBanner />
      
      <header className="bg-green-800 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="flex items-center gap-2 text-green-100 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold uppercase tracking-tight text-sm">Main Dashboard</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/sustainability" className="text-green-100 hover:text-white text-sm font-bold uppercase tracking-tight">Sustainability</Link>
              <Badge className="bg-green-700 text-green-100 border-none px-3 py-1">
                FIELD MODE ACTIVE
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
               <Tractor className="w-10 h-10 text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none">PASTURE AI</h1>
              <p className="text-green-200 font-bold uppercase text-xs tracking-widest mt-1">Farmer-Friendly View</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8 mt-4">
        
        <section className="space-y-4">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Primary Decision</h2>
           {isLoading || !p1 ? (
             <Skeleton className="h-96 w-full rounded-3xl" />
           ) : (
             <FarmerDecisionCard prediction={p1} />
           )}
        </section>

        <section className="space-y-4">
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Your Day at a Glance</h2>
           {isLoading || !p1 || !p2 || !p3 ? (
             <Skeleton className="h-64 w-full rounded-3xl" />
           ) : (
             <DailyTasksView predictions={[p1, p2, p3]} />
           )}
        </section>

        <section className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <Users className="w-6 h-6" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Community Insight</h3>
              </div>
              <p className="text-blue-50 text-lg font-medium leading-tight">
                "Most farms near you rested paddocks this week. Those that did saw 12% better regrowth."
              </p>
           </div>
           <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
              <Users className="w-32 h-32" />
           </div>
        </section>

        <div className="text-center pt-8">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">PastureAI v4.2 • Rural Ready</p>
           <button className="text-slate-500 font-bold underline text-sm">
              Enable Grandparent Mode (Simplified)
           </button>
        </div>

      </main>
    </div>
  );
};

export default FarmerView;
