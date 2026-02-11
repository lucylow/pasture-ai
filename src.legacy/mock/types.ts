export interface PastureState {
  pastureId: string;
  areaHa: number;
  currentBiomass: number;
  recoveryRate: number;
  soilSensitivity: number;
}

export interface GrazingPlan {
  pastureId: string;
  grazeFrom: string;
  grazeTo: string;
  expectedPostBiomass: number;
  recoveryDays: number;
}
