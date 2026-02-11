/**
 * Multi-pasture optimization view: grazing schedule across pastures.
 */
import { mockOptimizedGrazingPlan } from "@/mock/optimization"
import { mockPastures } from "@/mock/pastures"
import { format, parseISO } from "date-fns"
import { Calendar, MapPin, Leaf, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const pastureMap = new Map(mockPastures.map((p) => [p.pastureId, p]))

export function MultiPastureOptimizationPanel() {
  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5" />
        Multi-Pasture Plan
      </h4>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3 pr-2">
          {mockOptimizedGrazingPlan.map((plan, i) => {
            const pasture = pastureMap.get(plan.pastureId)
            return (
              <Card key={plan.pastureId} className="border-[#2C2C2A]/10">
                <CardHeader className="py-2 px-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#3F6B3F]" />
                      {plan.pastureId}
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      #{i + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-0 px-3 pb-3 space-y-1.5 text-xs text-[#2C2C2A]/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-[#2C2C2A]/50" />
                    {format(parseISO(plan.grazeFrom), "d MMM")} –{" "}
                    {format(parseISO(plan.grazeTo), "d MMM")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-3 w-3 text-[#3F6B3F]" />
                    Post-graze: {plan.expectedPostBiomass} t/ha · Rest {plan.recoveryDays}d
                  </div>
                  {pasture && (
                    <div className="text-[10px] text-[#2C2C2A]/50">
                      {pasture.areaHa} ha · {pasture.currentBiomass} t/ha now
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
      <p className="text-[10px] text-[#2C2C2A]/50 mt-2">
        AI-optimized sequence to maximize utilization & recovery.
      </p>
    </div>
  )
}
