import { BiomassPrediction } from "../../ai/ai.types";

export function AIConfidenceBar({
  mean,
  lower,
  upper,
}: {
  mean: number;
  lower: number;
  upper: number;
}) {
  return (
    <div className="mt-4 p-4 border rounded-xl bg-white shadow-sm">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Model confidence range
      </p>

      <div className="relative h-3 mt-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-green-200/50 rounded-full"
          style={{
            left: `${lower * 100}%`,
            width: `${(upper - lower) * 100}%`,
          }}
        />
        <div
          className="absolute h-full bg-green-600 rounded-full"
          style={{
            left: `${(mean - 0.01) * 100}%`,
            width: `2%`,
          }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
        <span>{Math.round(lower * 100)}%</span>
        <span className="text-slate-700 font-bold">{Math.round(mean * 100)}%</span>
        <span>{Math.round(upper * 100)}%</span>
      </div>
    </div>
  );
}
