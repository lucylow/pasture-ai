import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, DownloadIcon, PlayIcon, LeafIcon, DropletsIcon, ActivityIcon } from "lucide-react";

interface PaddockData {
  recorded_at: string;
  dry_biomass_g_m2: number;
  co2e_kg: number;
}

interface SustainabilityReport {
  farm_id: number;
  num_records: number;
  total_carbon_kg: number;
  total_co2e_kg: number;
  latest_by_paddock: Record<string, PaddockData>;
}

interface SustainabilityDashboardProps {
  farmId: number;
}

export default function SustainabilityDashboard({ farmId }: SustainabilityDashboardProps) {
  const [report, setReport] = useState<SustainabilityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmId) return;
    setLoading(true);
    fetch(`/api/v1/sustainability/report/farm/${farmId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch sustainability report");
        return r.json();
      })
      .then((json) => {
        setReport(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [farmId]);

  async function runPlanner() {
    if (!report) return;
    // demo paddocks pulled from report (or use API)
    const paddocks = Object.entries(report.latest_by_paddock).map(([pid, r]) => {
      return { id: Number(pid), area_ha: 1.0, biomass_g_m2: r.dry_biomass_g_m2 || 200.0 };
    });
    const payload = { paddocks, total_animal_units: 20, planning_horizon_days: 60, rest_days_required: 21 };
    
    try {
      const resp = await fetch("/api/v1/sustainability/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await resp.json();
      alert("Planner ran; allocations: " + json.allocations.length + " entries. Open console to inspect.");
      console.log(json);
    } catch (err) {
      alert("Failed to run planner");
    }
  }

  const handleDownload = () => {
    if (!report) return;
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `farm_${report.farm_id}_report.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Sustainability Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!report}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" onClick={runPlanner} disabled={!report} className="bg-emerald-600 hover:bg-emerald-700">
            <PlayIcon className="mr-2 h-4 w-4" />
            Run Planner
          </Button>
        </div>
      </div>

      {!report ? (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No data available</AlertTitle>
          <AlertDescription>
            No sustainability records found for this farm. Try seeding the demo data.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-100 bg-emerald-50/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CO₂e Sequestration</CardTitle>
              <LeafIcon className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{Math.round(report.total_co2e_kg).toLocaleString()} kg</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {report.num_records} field observations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbon Stock (C)</CardTitle>
              <ActivityIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(report.total_carbon_kg).toLocaleString()} kg</div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated above-ground organic carbon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Use Intensity</CardTitle>
              <DropletsIcon className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Heuristic</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on ET estimates & LAI
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Paddock Performance</CardTitle>
              <CardDescription>Latest sustainability metrics per paddock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Paddock ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Recorded</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Biomass (g/m²)</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">CO₂e (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {Object.entries(report.latest_by_paddock).map(([pid, r]) => (
                      <tr key={pid} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">Paddock {pid}</td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(r.recorded_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle text-right">{Math.round(r.dry_biomass_g_m2)}</td>
                        <td className="p-4 align-middle text-right font-semibold text-emerald-600">
                          {Math.round(r.co2e_kg).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
