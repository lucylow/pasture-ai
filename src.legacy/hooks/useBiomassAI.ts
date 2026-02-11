import { useQuery } from "@tanstack/react-query";
import { fetchBiomassPrediction } from "../ai/ai.api";

export function useBiomassAI(pastureId: string) {
  return useQuery({
    queryKey: ['ai', 'biomass', pastureId],
    queryFn: () => fetchBiomassPrediction(pastureId),
    enabled: !!pastureId,
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
  });
}
