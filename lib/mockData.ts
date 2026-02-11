export type MockFarm = {
  id: string;
  name: string;
  region: string;
  areaHa: number;
  herdSize: number;
};

export type MockPaddock = {
  id: string;
  farmId: string;
  name: string;
  areaHa: number;
  lastBiomass_gm2: number;
  recommendation: string;
  restDays: number;
};

export type MockWeeklyMetric = {
  paddockId: string;
  weekStart: string; // ISO date
  biomass_gm2: number;
  overgrazingEvents: number;
};

export type MockKpi = {
  id: string;
  label: string;
  value: string;
  description: string;
};

export const mockFarms: MockFarm[] = [
  {
    id: 'farm-1',
    name: 'Green Ridge Dairy',
    region: 'Waikato, NZ',
    areaHa: 120,
    herdSize: 240,
  },
  {
    id: 'farm-2',
    name: 'Riverbend Grazing Co-op',
    region: 'Canterbury, NZ',
    areaHa: 85,
    herdSize: 150,
  },
  {
    id: 'farm-3',
    name: 'Sunrise Hill Pastures',
    region: 'Victoria, AU',
    areaHa: 60,
    herdSize: 110,
  },
  {
    id: 'farm-4',
    name: 'Northern Paddock Co',
    region: 'Tasman, NZ',
    areaHa: 95,
    herdSize: 180,
  },
  {
    id: 'farm-5',
    name: 'Hill Country Beef',
    region: 'Manawatu, NZ',
    areaHa: 140,
    herdSize: 220,
  },
  {
    id: 'farm-6',
    name: 'Southern Grass Ltd',
    region: 'Southland, NZ',
    areaHa: 200,
    herdSize: 350,
  },
];

export const mockPaddocks: MockPaddock[] = [
  {
    id: 'paddock-1',
    farmId: 'farm-1',
    name: 'North Flat',
    areaHa: 8.5,
    lastBiomass_gm2: 780,
    recommendation: 'Rest 6 days, then graze moderately.',
    restDays: 4,
  },
  {
    id: 'paddock-2',
    farmId: 'farm-1',
    name: 'River Edge',
    areaHa: 6.3,
    lastBiomass_gm2: 520,
    recommendation: 'Safe to graze lightly today.',
    restDays: 1,
  },
  {
    id: 'paddock-3',
    farmId: 'farm-2',
    name: 'South Slope',
    areaHa: 5.1,
    lastBiomass_gm2: 940,
    recommendation: 'Delay grazing 10 days for full recovery.',
    restDays: 7,
  },
  {
    id: 'paddock-4',
    farmId: 'farm-2',
    name: 'West Meadow',
    areaHa: 4.2,
    lastBiomass_gm2: 410,
    recommendation: 'Rest 12–14 days. Consider soil amendment.',
    restDays: 10,
  },
  {
    id: 'paddock-5',
    farmId: 'farm-3',
    name: 'East Hill',
    areaHa: 7.8,
    lastBiomass_gm2: 890,
    recommendation: 'Rest 3–4 days, then graze lightly.',
    restDays: 2,
  },
  {
    id: 'paddock-6',
    farmId: 'farm-4',
    name: 'Upper Flat',
    areaHa: 12.1,
    lastBiomass_gm2: 650,
    recommendation: 'Rest 5–7 days, then graze moderately.',
    restDays: 5,
  },
  {
    id: 'paddock-7',
    farmId: 'farm-5',
    name: 'Lower Valley',
    areaHa: 9.2,
    lastBiomass_gm2: 720,
    recommendation: 'Rest 5 days, then graze moderately.',
    restDays: 3,
  },
  {
    id: 'paddock-8',
    farmId: 'farm-5',
    name: 'Upper Hills',
    areaHa: 6.4,
    lastBiomass_gm2: 580,
    recommendation: 'Rest 8–10 days before grazing.',
    restDays: 6,
  },
  {
    id: 'paddock-9',
    farmId: 'farm-6',
    name: 'South Meadow',
    areaHa: 14.2,
    lastBiomass_gm2: 890,
    recommendation: 'Rest 3–4 days, then graze lightly.',
    restDays: 2,
  },
  {
    id: 'paddock-10',
    farmId: 'farm-6',
    name: 'North Pasture',
    areaHa: 11.8,
    lastBiomass_gm2: 450,
    recommendation: 'Rest 14 days. Consider soil amendment.',
    restDays: 12,
  },
];

export const mockWeeklyMetrics: MockWeeklyMetric[] = [
  { paddockId: 'paddock-1', weekStart: '2025-12-01', biomass_gm2: 620, overgrazingEvents: 1 },
  { paddockId: 'paddock-1', weekStart: '2025-12-08', biomass_gm2: 710, overgrazingEvents: 0 },
  { paddockId: 'paddock-1', weekStart: '2025-12-15', biomass_gm2: 780, overgrazingEvents: 0 },
  { paddockId: 'paddock-1', weekStart: '2025-12-22', biomass_gm2: 720, overgrazingEvents: 0 },
  { paddockId: 'paddock-2', weekStart: '2025-12-01', biomass_gm2: 480, overgrazingEvents: 2 },
  { paddockId: 'paddock-2', weekStart: '2025-12-08', biomass_gm2: 510, overgrazingEvents: 1 },
  { paddockId: 'paddock-2', weekStart: '2025-12-15', biomass_gm2: 520, overgrazingEvents: 0 },
  { paddockId: 'paddock-3', weekStart: '2025-12-01', biomass_gm2: 880, overgrazingEvents: 0 },
  { paddockId: 'paddock-3', weekStart: '2025-12-08', biomass_gm2: 910, overgrazingEvents: 0 },
  { paddockId: 'paddock-3', weekStart: '2025-12-15', biomass_gm2: 940, overgrazingEvents: 0 },
  { paddockId: 'paddock-5', weekStart: '2025-12-01', biomass_gm2: 820, overgrazingEvents: 0 },
  { paddockId: 'paddock-5', weekStart: '2025-12-08', biomass_gm2: 855, overgrazingEvents: 0 },
  { paddockId: 'paddock-5', weekStart: '2025-12-15', biomass_gm2: 890, overgrazingEvents: 0 },
  { paddockId: 'paddock-4', weekStart: '2025-12-01', biomass_gm2: 380, overgrazingEvents: 2 },
  { paddockId: 'paddock-4', weekStart: '2025-12-08', biomass_gm2: 395, overgrazingEvents: 1 },
  { paddockId: 'paddock-4', weekStart: '2025-12-15', biomass_gm2: 410, overgrazingEvents: 0 },
  { paddockId: 'paddock-6', weekStart: '2025-12-01', biomass_gm2: 610, overgrazingEvents: 1 },
  { paddockId: 'paddock-6', weekStart: '2025-12-08', biomass_gm2: 630, overgrazingEvents: 0 },
  { paddockId: 'paddock-6', weekStart: '2025-12-15', biomass_gm2: 650, overgrazingEvents: 0 },
  { paddockId: 'paddock-7', weekStart: '2025-12-01', biomass_gm2: 680, overgrazingEvents: 0 },
  { paddockId: 'paddock-7', weekStart: '2025-12-08', biomass_gm2: 700, overgrazingEvents: 0 },
  { paddockId: 'paddock-7', weekStart: '2025-12-15', biomass_gm2: 720, overgrazingEvents: 0 },
];

export const mockKpis: MockKpi[] = [
  {
    id: 'kpi-1',
    label: 'Grazing efficiency uplift (demo)',
    value: '+18%',
    description:
      'Mocked improvement in utilization vs. baseline once co-op adopts coordinated rest windows.',
  },
  {
    id: 'kpi-2',
    label: 'Overgrazing events reduction (demo)',
    value: '−42%',
    description:
      'Mocked reduction in overgrazing flags per paddock after using PastureAI recommendations.',
  },
  {
    id: 'kpi-3',
    label: 'Farms participating',
    value: '12',
    description: 'Demo cooperative size seeded into the dashboard for hackathon pitches.',
  },
  {
    id: 'kpi-4',
    label: 'Biomass stability index',
    value: '0.86',
    description: 'Simple normalized index representing smoother biomass curves over the season.',
  },
];
