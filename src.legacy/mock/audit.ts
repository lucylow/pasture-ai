export const mockAuditLogs = [
  {
    id: "log_001",
    timestamp: "2026-01-14T05:30:00Z",
    pastureId: "P2",
    action: "GRAZE_DELAYED",
    modelVersion: "biomass-v3.1",
    confidence: 0.88,
    userDecision: "Delayed grazing based on low biomass confidence",
  },
  {
    id: "log_002",
    timestamp: "2026-01-22T06:10:00Z",
    pastureId: "P3",
    action: "GRAZE_STARTED",
    modelVersion: "biomass-v3.2",
    confidence: 0.94,
    userDecision: "Started grazing per recommended window",
  },
  {
    id: "log_003",
    timestamp: "2026-02-02T04:55:00Z",
    pastureId: "P4",
    action: "PASTURE_REST_EXTENDED",
    modelVersion: "biomass-v3.2",
    confidence: 0.91,
    userDecision: "Extended rest to reduce compaction risk",
  },
];
