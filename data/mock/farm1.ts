// data/mock/farm1.ts
export type FarmTile = {
  image: string;
  biomass: number;
  ciLow: number;
  ciHigh: number;
  recommendation: string;
  outputs: {
    Dry_Green_g: number;
    Dry_Dead_g: number;
    Dry_Clover_g: number;
    Dry_Total_g: number;
    coverage_pct: number;
    pasture_health: string;
    confidence_score: number;
  };
};

export type FarmData = {
  id?: string;
  name: string;
  region: string;
  area: number;
  latestTile: FarmTile;
};

export const mockFarmData: FarmData = {
  id: 'f1',
  name: 'Green Hollow Ranch',
  region: 'Tasmania',
  area: 120,
  latestTile: {
    image: '/healthy-green-pasture-grassland-thumbnail.jpg',
    biomass: 820,
    ciLow: 760,
    ciHigh: 880,
    recommendation: 'Rest 5–7 days',
    outputs: {
      Dry_Green_g: 420,
      Dry_Dead_g: 210,
      Dry_Clover_g: 190,
      Dry_Total_g: 820,
      coverage_pct: 78,
      pasture_health: 'Good',
      confidence_score: 0.86
    }
  }
};

export const mockFarmsForDemo: FarmData[] = [
  mockFarmData,
  {
    id: 'f2',
    name: 'Riverbend Farm',
    region: 'Tasmania',
    area: 95,
    latestTile: {
      image: '/optimal-lush-green-grass-field-thumbnail.jpg',
      biomass: 740,
      ciLow: 680,
      ciHigh: 800,
      recommendation: 'Graze lightly',
      outputs: {
        Dry_Green_g: 380,
        Dry_Dead_g: 180,
        Dry_Clover_g: 180,
        Dry_Total_g: 740,
        coverage_pct: 72,
        pasture_health: 'Good',
        confidence_score: 0.82
      }
    }
  },
  {
    id: 'f3',
    name: 'Eyre Station',
    region: 'Victoria',
    area: 400,
    latestTile: {
      image: '/fair-condition-pasture-meadow-thumbnail.jpg',
      biomass: 900,
      ciLow: 860,
      ciHigh: 940,
      recommendation: 'Rotate to next paddock',
      outputs: {
        Dry_Green_g: 480,
        Dry_Dead_g: 220,
        Dry_Clover_g: 200,
        Dry_Total_g: 900,
        coverage_pct: 82,
        pasture_health: 'Excellent',
        confidence_score: 0.91
      }
    }
  },
  {
    id: 'f4',
    name: 'Hill Country Beef',
    region: 'Manawatu, NZ',
    area: 140,
    latestTile: {
      image: '/overgrazed-dry-pasture-land-thumbnail.jpg',
      biomass: 410,
      ciLow: 350,
      ciHigh: 470,
      recommendation: 'Rest 14 days. Consider soil amendment.',
      outputs: {
        Dry_Green_g: 180,
        Dry_Dead_g: 160,
        Dry_Clover_g: 70,
        Dry_Total_g: 410,
        coverage_pct: 42,
        pasture_health: 'Fair',
        confidence_score: 0.78
      }
    }
  }
];
