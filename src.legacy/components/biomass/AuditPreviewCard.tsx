/**
 * Audit / compliance preview for decision trail.
 */
import { auditPreview } from "@/mock/auditPreview"
import { biomassCopy } from "@/lib/image2biomassCopy"
import { FileText } from "lucide-react"

export function AuditPreviewCard() {
  const a = auditPreview

  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-[#2C2C2A]/70" />
        <h4 className="text-sm font-medium text-[#2C2C2A]">{biomassCopy.auditTitle}</h4>
      </div>
      <p className="text-[10px] text-[#2C2C2A]/50 mb-2">{a.decisionId}</p>
      <div className="space-y-1.5 text-xs">
        <div>
          <span className="text-[#2C2C2A]/60 font-medium">{biomassCopy.auditModelsUsed}</span>
          <ul className="text-[#2C2C2A]/80 mt-0.5 space-y-0.5">
            {Object.entries(a.modelsUsed).map(([k, v]) => (
              <li key={k}>
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[#2C2C2A]/60 font-medium">{biomassCopy.auditInputs}</span>
          <p className="text-[#2C2C2A]/80 mt-0.5">{a.inputs.join(", ")}</p>
        </div>
        <div>
          <span className="text-[#2C2C2A]/60 font-medium">{biomassCopy.auditOutputs}</span>
          <p className="text-[#2C2C2A]/80 mt-0.5">{a.outputs.join(", ")}</p>
        </div>
      </div>
    </div>
  )
}
