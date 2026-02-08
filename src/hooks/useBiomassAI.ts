import { useQuery } from "@tanstack/react-query";
import { fetchBiomassPrediction } from "../ai/ai.api";

export function useBiomassAI(pastureId: string) {
  return useQuery({
    queryKey: ["ai", "biomass", pastureId],
    queryFn: () => fetchBiomassPrediction(pastureId),
    staleTime: 1000 * 60 * 60 * 24, // Keep data fresh for 24 hours (offline-first)
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
    refetchOnWindowFocus: false, // Don't refetch on focus (better for bad signal)
    refetchOnReconnect: "always", // Only refetch when we actually get signal back
  });
}
