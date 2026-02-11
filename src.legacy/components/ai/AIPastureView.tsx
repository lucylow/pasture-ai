import { useBiomassAI } from "../../hooks/useBiomassAI";
import { AIBiomassLayer } from "./AIBiomassLayer";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { AIExplainability } from "./AIExplainability";
import { AIConfidenceBar } from "./AIConfidenceBar";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, TrendingUp, Info } from "lucide-react";

export function AIPastureView({ pastureId }: { pastureId: string }) {
  const { data, isLoading, isError } = useBiomassAI(pastureId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 h-[500px] rounded-xl bg-slate-100 flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-500">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <p>Failed to load AI biomass prediction. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Spatial Biomass Analysis</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time model inference based on satellite & sensor fusion</p>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{data.growthRateKgPerHaPerDay} kg/ha/day</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">Estimated Growth Rate</p>
            </div>
        </div>
        
        <div className="relative h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 group">
          {/* 
            Map placeholder for demo environments. 
            In production, this would be wrapped with <Map /> from react-map-gl
          */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {/* Simulating the AI Layer dots if map doesn't render */}
             <div className="relative w-full h-full">
                {data.spatialGrid.map((point, i) => (
                    <div 
                        key={i}
                        className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse"
                        style={{
                            left: `${40 + (i * 10)}%`,
                            top: `${30 + (i * 12)}%`,
                            backgroundColor: point.biomass > 2500 ? '#3F6B3F' : point.biomass > 1500 ? '#90A583' : '#8A6B4A',
                            opacity: 1 - point.uncertainty
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
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
                Spatial grid data is generated using a transformer-based vision model fine-tuned on regional pasture characteristics. 
                Uncertainty values represent the model's confidence based on atmospheric interference and sensor noise.
            </p>
        </div>
      </div>

      <div className="space-y-6">
        <AIRecommendationCard prediction={data} />
        
        <div className="space-y-1">
            <AIConfidenceBar
                mean={data.confidence.mean}
                lower={data.confidence.lower}
                upper={data.confidence.upper}
            />
            <p className="px-2 text-[10px] text-slate-400 italic">
                * Model accuracy is validated against ground-truth rising plate meter readings.
            </p>
        </div>

        <AIExplainability prediction={data} />
        
        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400">Next inference scheduled for 06:00 AM UTC</p>
        </div>
      </div>
    </div>
  );
}
