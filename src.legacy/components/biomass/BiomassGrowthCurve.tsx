/**
 * Growth curve chart with uncertainty ribbon.
 * Uses biomassTimeline mock data.
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { biomassTimeline } from "@/mock/biomassTimeline"
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { biomassCopy } from "@/lib/image2biomassCopy"
import { Info } from "lucide-react"

const chartData = biomassTimeline.map((d) => ({
  date: d.date.slice(5),
  mean: d.meanBiomass,
  lower: d.uncertainty[0],
  upper: d.uncertainty[1],
}))

export function BiomassGrowthCurve() {
  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-[#2C2C2A]">Growth over time</h4>
        <TooltipProvider>
          <TooltipUI>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-[#2C2C2A]/50 hover:text-[#2C2C2A]"
                aria-label="Info"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px] text-xs">
                {biomassCopy.meanBiomassTitle}. Shaded area shows uncertainty.
              </p>
            </TooltipContent>
          </TooltipUI>
        </TooltipProvider>
      </div>
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="uncertaintyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3F6B3F" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3F6B3F" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2A/10" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#2C2C2A/50" />
            <YAxis
              domain={[1.5, 4]}
              tick={{ fontSize: 10 }}
              stroke="#2C2C2A/50"
              tickFormatter={(v) => `${v} t`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid #2C2C2A/20",
              }}
              formatter={(value: number) => [`${value.toFixed(2)} t/ha`, "Mean"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stackId="1"
              stroke="none"
              fill="#F6F5F2"
            />
            <Area
              type="monotone"
              dataKey="upper"
              stackId="1"
              stroke="none"
              fill="url(#uncertaintyFill)"
            />
            <Area
              type="monotone"
              dataKey="mean"
              stroke="#3F6B3F"
              strokeWidth={2}
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
