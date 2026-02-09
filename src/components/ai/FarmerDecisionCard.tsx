import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { translateAction, translateReason, getFarmerAdvice } from "../../lib/DecisionTranslator";
import { BiomassPrediction } from "../../ai/ai.types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ReadAloudButton } from "./ReadAloudButton";

export function FarmerDecisionCard({ prediction }: { prediction: BiomassPrediction }) {
  const { action, suggestedInDays, reasoning } = prediction.recommendation;
  
  const colors = {
    GRAZE: "bg-green-600 border-green-700 text-white",
    WAIT: "bg-amber-500 border-amber-600 text-white",
    REST: "bg-red-600 border-red-700 text-white",
  };

  const actionEmoji = {
    GRAZE: "🐄",
    WAIT: "⏳",
    REST: "🛑",
  };

  const translatedAction = translateAction(action);
  const advice = getFarmerAdvice(prediction.pastureId, action, suggestedInDays);

  const textToRead = `${translatedAction}. ${advice}. ${reasoning.map(translateReason).join('. ')}`;

  return (
    <Card className="overflow-hidden border-2 shadow-xl bg-white">
      <div className={`h-4 w-full ${action === 'GRAZE' ? 'bg-green-600' : action === 'REST' ? 'bg-red-600' : 'bg-amber-500'}`} />
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className={`inline-flex items-center rounded-full border px-4 py-1 text-lg uppercase font-black ${colors[action] || colors.WAIT}`}>
            {actionEmoji[action] || "⏳"} {translatedAction}
          </div>
          <ReadAloudButton text={textToRead} />
        </div>
        <CardTitle className="text-4xl font-extrabold text-slate-900 leading-tight">
          {advice}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
          <h4 className="text-lg font-bold text-slate-700 mb-3 uppercase tracking-wide">Why?</h4>
          <ul className="space-y-4">
            {reasoning.map((r, i) => (
              <li key={i} className="text-xl text-slate-800 flex gap-3 font-medium">
                <span className="shrink-0 text-green-600 font-bold">✓</span>
                {translateReason(r)}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
           <ConfidenceBadge mean={prediction.confidence.mean} />
           <p className="text-sm font-bold text-slate-400">Pasture: {prediction.pastureId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
