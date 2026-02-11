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
  {
    id: '1',
    farmName: 'Green Valley Co-op',
    paddockName: 'North Ridge',
    biomassKgHa: 2100,
    health: 'good',
    lastUpdated: '2026-02-09T09:15:00Z',
    nextAction: 'Graze lightly for 3 days',
    country: 'Canada'
  },
  {
    id: '2',
    farmName: 'Riverbend Dairy',
    paddockName: 'Lot 4A',
    biomassKgHa: 1450,
    health: 'fair',
    lastUpdated: '2026-02-08T16:30:00Z',
    nextAction: 'Rest for 10 days',
    country: 'USA'
  },
  {
    id: '3',
    farmName: 'High Plains Ranch',
    paddockName: 'South Block',
    biomassKgHa: 2600,
    health: 'excellent',
    lastUpdated: '2026-02-07T11:45:00Z',
    nextAction: 'Safe to graze today',
    country: 'Argentina'
  },
  {
    id: '4',
    farmName: 'Sundown Station',
    paddockName: 'West Paddock',
    biomassKgHa: 800,
    health: 'poor',
    lastUpdated: '2026-02-06T14:00:00Z',
    nextAction: 'Defer grazing 21 days',
    country: 'Australia'
  },
  {
    id: '5',
    farmName: 'Misty Creek Farm',
    paddockName: 'Creek Flat',
    biomassKgHa: 1900,
    health: 'good',
    lastUpdated: '2026-02-09T06:20:00Z',
    nextAction: 'Monitor regrowth',
    country: 'New Zealand'
  }
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
  {
    id: 'p1',
    author: 'Maria',
    farmName: 'Small Steps Farm',
    title: 'NDVI vs. boots-on-ground',
    content: 'Tried the app on three paddocks; matches our plate meter within ~10%. Impressed with the consistency across different lighting conditions.',
    createdAt: '2026-02-09T07:10:00Z',
    likes: 12,
    comments: 3
  },
  {
    id: 'p2',
    author: 'Ibrahim',
    farmName: 'Sunrise Grazing',
    title: 'Rotational schedule tweak',
    content: 'Using the biomass estimates to shorten grazing windows boosted regrowth by about 15% over two months.',
    createdAt: '2026-02-08T19:40:00Z',
    likes: 8,
    comments: 1
  },
  {
    id: 'p3',
    author: 'Chen Wei',
    farmName: 'Jade Hill Pastoral',
    title: 'Offline mode saved us',
    content: "We're in a low-connectivity zone. The offline caching meant we could still log paddock assessments and sync later.",
    createdAt: '2026-02-07T12:05:00Z',
    likes: 21,
    comments: 5
  }
]
