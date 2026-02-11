/**
 * Pasture view: BiomassMap + recommendation card.
 * Image2Biomass spec: map with uncertainty overlay, hover details, recommendation cards.
 */
import { useParams } from "react-router-dom";
import { BiomassMap } from "@/components/ai/BiomassMap";
import { AIRecommendationCard } from "@/components/ai/AIRecommendationCard";
import { useBiomassAI } from "@/hooks/useBiomassAI";
import { Skeleton } from "@/components/ui/skeleton";

export function PastureView() {
  const { pastureId } = useParams<{ pastureId: string }>();
  const id = pastureId ?? "demo";
  const { data: prediction, isLoading } = useBiomassAI(id);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Pasture {id}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Biomass map with uncertainty overlay · Click a tile for details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BiomassMap pastureId={id} />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : prediction ? (
            <AIRecommendationCard prediction={prediction} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-500 text-sm">
              Select a pasture or load AI prediction to see recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
