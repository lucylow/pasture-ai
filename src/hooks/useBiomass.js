import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lovable } from '../lib/lovable'

export function useBiomass(userId) {
  return useQuery({
    queryKey: ['biomass', userId],
    queryFn: async () => {
      const { data: analyses } = await lovable.db.from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      return { images: [], analyses: analyses || [] }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!userId
  })
}

export function useBiomassPredict() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ file, gps }) => {
      // Mock prediction for demo
      await new Promise(r => setTimeout(r, 800))
      return {
        predictions: {
          drygreeng: 152.1,
          drytotalg: 187.3,
          pasturehealth: 'good'
        },
        recommendations: {
          action: 'graze',
          days: 4
        },
        confidence: 0.85
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biomass'] })
    }
  })
}
