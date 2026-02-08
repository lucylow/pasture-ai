import React from 'react';
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BiomassPrediction } from "../../ai/ai.types";
import { getFarmerAdvice } from "../../lib/DecisionTranslator";

export function DailyTasksView({ predictions }: { predictions: BiomassPrediction[] }) {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-slate-900 text-white rounded-t-lg py-4">
        <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          Today's Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y-2 divide-slate-100">
          {predictions.map((p, i) => {
            const advice = getFarmerAdvice(p.pastureId, p.recommendation.action, p.recommendation.suggestedInDays);
            const isReady = p.recommendation.action === 'GRAZE' && p.recommendation.suggestedInDays === 0;
            
            return (
              <div key={i} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  {isReady ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                       <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400">
                       <Clock className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-tighter">
                    {p.pastureId}
                  </p>
                  <p className="text-xl font-bold text-slate-900 leading-tight">
                    {advice}
                  </p>
                </div>
              </div>
            );
          })}
          
          <div className="p-5 bg-slate-50">
             <p className="text-sm font-medium text-slate-500 italic text-center">
               Checked {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Safe to use offline.
             </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
