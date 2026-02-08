import { BiomassPrediction } from "../../ai/ai.types";

export function AIExplainability({
  prediction,
}: {
  prediction: BiomassPrediction;
}) {
  return (
    <div className="mt-6 p-4 border rounded-xl bg-white shadow-sm">
      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        What influenced this estimate
      </h4>

      <ul className="mt-4 space-y-3">
        {prediction.explainability.topDrivers.map((d) => (
          <li key={d.feature}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">{d.feature}</span>
              <span className="text-slate-800 font-semibold">
                {Math.round(d.impact * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-400 h-full rounded-full" 
                style={{ width: `${d.impact * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
