import { useQuery } from '@tanstack/react-query'
import { mockAnalyses } from '../mock/data'

export function useMockAnalyses() {
  return useQuery({
    queryKey: ['mock-analyses'],
    queryFn: async () => {
      await new Promise(res => setTimeout(res, 200))
      return mockAnalyses
    },
    staleTime: 60_000
  })
}
