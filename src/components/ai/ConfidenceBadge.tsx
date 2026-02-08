import React from 'react';
import { translateConfidence } from "../../lib/DecisionTranslator";
import { Badge } from "../ui/badge";

export function ConfidenceBadge({ mean }: { mean: number }) {
  const confidenceText = translateConfidence(mean);
  const color = mean >= 0.8 ? "bg-blue-100 text-blue-800" : mean >= 0.5 ? "bg-slate-100 text-slate-800" : "bg-amber-100 text-amber-800";
  
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Confidence</span>
      <Badge variant="secondary" className={`${color} border-none font-bold py-1`}>
        {confidenceText}
      </Badge>
    </div>
  );
}
