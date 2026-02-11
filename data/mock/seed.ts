// data/mock/seed.ts
export const farms = [
  {
    id: 'f1',
    name: 'Green Hollow Ranch',
    region: 'Tasmania',
    area: 120,
    latestTile: {
      biomass: 820,
      ciLow: 760,
      ciHigh: 880,
      recommendation: 'Rest 5–7 days',
      image: '/healthy-green-pasture-grassland-thumbnail.jpg'
    }
  },
  {
    id: 'f2',
    name: 'Riverbend Farm',
    region: 'Tasmania',
    area: 95,
    latestTile: {
      biomass: 740,
      ciLow: 680,
      ciHigh: 800,
      recommendation: 'Graze lightly',
      image: '/optimal-lush-green-grass-field-thumbnail.jpg'
    }
  },
  {
    id: 'f3',
    name: 'Eyre Station',
    region: 'Victoria',
    area: 400,
    latestTile: {
      biomass: 900,
      ciLow: 860,
      ciHigh: 940,
      recommendation: 'Rotate to next paddock',
      image: '/fair-condition-pasture-meadow-thumbnail.jpg'
    }
  }
];

export const pilots = [
  { id: 'p1', farms: 30, rmse: 0.32, validated: true, notes: 'Regional pilot, mixed soil' },
  { id: 'p2', farms: 60, rmse: 0.29, validated: true, notes: 'Cross-biome pilot' },
  { id: 'p3', farms: 12, rmse: 0.28, validated: true, notes: 'Tasmanian co-op demo' },
  { id: 'p4', farms: 45, rmse: 0.31, validated: false, notes: 'NZ expansion pilot' }
];
