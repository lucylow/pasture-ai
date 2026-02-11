import { BiomassPrediction } from "../../ai/ai.types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, Info, TrendingUp, ShieldAlert, Leaf, Gauge } from "lucide-react";

export function AIRecommendationCard({
  prediction,
}: {
  prediction: BiomassPrediction;
}) {
  const rec = prediction.recommendation;

  const actionColors = {
    GRAZE: "bg-green-100 text-green-800 border-green-200",
    WAIT: "bg-amber-100 text-amber-800 border-amber-200",
    REST: "bg-slate-100 text-slate-800 border-slate-200",
    HARVEST: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const actionLabels = {
    GRAZE: "Graze pasture",
    WAIT: "Wait before grazing",
    REST: "Rest pasture",
    HARVEST: "Optimal Harvest",
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white">
      <div className={`h-1.5 w-full ${rec.action === 'GRAZE' ? 'bg-green-500' : rec.action === 'HARVEST' ? 'bg-blue-500' : 'bg-amber-500'}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              AI Recommendation
            </p>
            {rec.confidence && (
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">{(rec.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
            )}
          </div>
          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${actionColors[rec.action]}`}>
            {rec.action}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
          {actionLabels[rec.action]}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Suggested in <span className="font-semibold text-slate-900">{rec.suggestedInDays} days</span></span>
        </div>

        {rec.expectedKpiImpact && (
          <div className="grid grid-cols-2 gap-3">
            {rec.expectedKpiImpact.biomass_change_pct && (
              <div className="p-2 rounded-md bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Biomass
                </div>
                <div className="text-lg font-bold text-emerald-900 leading-none">
                  {rec.expectedKpiImpact.biomass_change_pct}
                </div>
              </div>
            )}
            {rec.expectedKpiImpact.overgrazing_risk && (
              <div className="p-2 rounded-md bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-700 uppercase mb-1">
                  <ShieldAlert className="w-3 h-3" />
                  Risk
                </div>
                <div className="text-lg font-bold text-rose-900 leading-none">
                  {rec.expectedKpiImpact.overgrazing_risk}
                </div>
              </div>
            )}
            {rec.expectedKpiImpact.soil_carbon_proxy_tco2 && (
              <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase mb-1">
                  <Leaf className="w-3 h-3" />
                  Carbon
                </div>
                <div className="text-lg font-bold text-blue-900 leading-none">
                  {rec.expectedKpiImpact.soil_carbon_proxy_tco2}
                </div>
              </div>
            )}
            {rec.expectedKpiImpact.recovery_stability && (
              <div className="p-2 rounded-md bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Stability
                </div>
                <div className="text-lg font-bold text-indigo-900 leading-none">
                  {rec.expectedKpiImpact.recovery_stability}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-tight">
            <Info className="w-3.5 h-3.5" />
            Reasoning
          </div>
          <ul className="space-y-2.5">
            {rec.reasoning.map((r, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-3 leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
