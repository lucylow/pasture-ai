/**
 * Explainability panel using AI mock data.
 * Bar charts for feature attribution, uncertainty breakdown.
 */
import {
  featureAttribution,
  uncertaintyBreakdown,
} from "@/mock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function AIExplainabilityPanel() {
  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider mb-3">
        Why did the AI say this?
      </h4>
      <Tabs defaultValue="attribution" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="attribution">Feature Attribution</TabsTrigger>
          <TabsTrigger value="uncertainty">Uncertainty</TabsTrigger>
        </TabsList>
        <TabsContent value="attribution" className="mt-3">
          <p className="text-sm text-[#2C2C2A]/80 mb-3 italic">
            {featureAttribution.explanationSummary}
          </p>
          <ul className="space-y-2.5">
            {featureAttribution.contributions.map((c) => (
              <li key={c.feature}>
                <div className="flex justify-between text-sm mb-0.5">
                  <span className="text-[#2C2C2A]/80">{c.feature}</span>
                  <span className="font-medium text-[#2C2C2A]">
                    {Math.round(c.weight * 100)}%
                  </span>
                </div>
                <Progress value={c.weight * 100} className="h-1.5" />
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="uncertainty" className="mt-3">
          <p className="text-sm text-[#2C2C2A]/80 mb-3 italic">
            {uncertaintyBreakdown.interpretation}
          </p>
          <div className="space-y-2.5">
            {uncertaintyBreakdown.components.map((c) => (
              <div key={c.source} className="flex items-center gap-3">
                <span className="text-sm text-[#2C2C2A]/80 w-40 shrink-0">{c.source}</span>
                <Progress
                  value={(c.contribution / uncertaintyBreakdown.totalStd) * 100}
                  className="flex-1 h-2"
                />
                <span className="text-xs font-medium text-[#2C2C2A] w-8">
                  {c.contribution.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#2C2C2A]/60 mt-3">
            Total σ = {uncertaintyBreakdown.totalStd.toFixed(2)} t/ha
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
