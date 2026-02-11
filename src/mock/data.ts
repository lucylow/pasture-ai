export type PastureHealth = 'poor' | 'fair' | 'good' | 'excellent'

export interface PastureAnalysis {
  id: string
  farmName: string
  paddockName: string
  biomassKgHa: number
  health: PastureHealth
  lastUpdated: string
  nextAction: string
  country: string
}

export const mockAnalyses: PastureAnalysis[] = [
  { id: '1', farmName: 'Green Valley Co-op', paddockName: 'North Ridge', biomassKgHa: 2100, health: 'good', lastUpdated: '2026-02-09T09:15:00Z', nextAction: 'Graze lightly for 3 days', country: 'Canada' },
  { id: '2', farmName: 'Riverbend Dairy', paddockName: 'Lot 4A', biomassKgHa: 1450, health: 'fair', lastUpdated: '2026-02-08T16:30:00Z', nextAction: 'Rest for 10 days', country: 'USA' },
  { id: '3', farmName: 'High Plains Ranch', paddockName: 'South Block', biomassKgHa: 2600, health: 'excellent', lastUpdated: '2026-02-07T11:45:00Z', nextAction: 'Safe to graze today', country: 'Argentina' },
]

export interface CommunityPost {
  id: string
  author: string
  farmName: string
  title: string
  content: string
  createdAt: string
  likes: number
  comments: number
}

export const mockCommunityPosts: CommunityPost[] = [
  { id: 'p1', author: 'Maria', farmName: 'Small Steps Farm', title: 'NDVI vs. boots-on-ground', content: 'Tried the app on three paddocks; matches our plate meter within ~10%.', createdAt: '2026-02-09T07:10:00Z', likes: 12, comments: 3 },
  { id: 'p2', author: 'Ibrahim', farmName: 'Sunrise Grazing', title: 'Rotational schedule tweak', content: 'Using the biomass estimates to shorten grazing windows boosted regrowth.', createdAt: '2026-02-08T19:40:00Z', likes: 8, comments: 1 },
]
