/**
 * Audit log + regulatory export preview.
 * Shows decision trail for compliance.
 */
import { mockAuditLogs } from "@/mock/audit"
import { auditPreview } from "@/mock/auditPreview"
import { format, parseISO } from "date-fns"
import { FileCheck, Clock, Cpu, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { biomassCopy } from "@/lib/image2biomassCopy"

const actionLabels: Record<string, string> = {
  GRAZE_DELAYED: "Grazing delayed",
  GRAZE_STARTED: "Grazing started",
  PASTURE_REST_EXTENDED: "Rest extended",
}

export function AuditLogPanel() {
  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm space-y-4">
      <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider flex items-center gap-2">
        <FileCheck className="h-3.5 w-3.5" />
        {biomassCopy.auditTitle}
      </h4>

      {/* Regulatory preview summary */}
      <div className="rounded-lg bg-[#2C2C2A]/5 p-3 text-xs space-y-2">
        <div className="font-medium text-[#2C2C2A]">
          {auditPreview.decisionId} · {format(parseISO(auditPreview.timestamp), "d MMM yyyy")}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {biomassCopy.auditModelsUsed}: image2biomass {auditPreview.modelsUsed.image2biomass}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[#2C2C2A]/70">
          <div>
            <strong>Inputs:</strong> {auditPreview.inputs.join(", ")}
          </div>
          <div>
            <strong>Outputs:</strong> {auditPreview.outputs.join(", ")}
          </div>
        </div>
      </div>

      {/* Audit log entries */}
      <ScrollArea className="h-[140px]">
        <div className="space-y-2 pr-2">
          {mockAuditLogs.map((log) => (
            <div
              key={log.id}
              className="flex gap-2 text-xs border-l-2 border-[#3F6B3F]/30 pl-3 py-1"
            >
              <div className="flex-shrink-0 text-[#2C2C2A]/50">
                <Clock className="h-3 w-3 inline mr-1" />
                {format(parseISO(log.timestamp), "d MMM HH:mm")}
              </div>
              <div className="min-w-0">
                <span className="font-medium">{log.pastureId}</span>
                <ArrowRight className="h-3 w-3 inline mx-1 text-[#2C2C2A]/40" />
                <span>{actionLabels[log.action] ?? log.action}</span>
                <div className="text-[10px] text-[#2C2C2A]/60 mt-0.5">
                  {log.userDecision}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
