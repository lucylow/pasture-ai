import { GrazingPlan } from "./types";

export const mockOptimizedGrazingPlan: GrazingPlan[] = [
  {
    pastureId: "P3",
    grazeFrom: "2026-02-07",
    grazeTo: "2026-02-11",
    expectedPostBiomass: 2.9,
    recoveryDays: 24,
  },
  {
    pastureId: "P1",
    grazeFrom: "2026-02-14",
    grazeTo: "2026-02-19",
    expectedPostBiomass: 2.6,
    recoveryDays: 28,
  },
  {
    pastureId: "P5",
    grazeFrom: "2026-02-23",
    grazeTo: "2026-02-27",
    expectedPostBiomass: 3.0,
    recoveryDays: 22,
  },
];
