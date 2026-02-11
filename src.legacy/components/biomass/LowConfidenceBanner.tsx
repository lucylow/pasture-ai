/**
 * AI Failure Mode UI — shown when confidence drops below threshold.
 * Degraded styling, human-review prompt.
 */
import { AlertTriangle, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const CONFIDENCE_THRESHOLD = 0.75
const WARNING_THRESHOLD = 0.85

type Severity = "normal" | "warning" | "degraded"

export function LowConfidenceBanner({
  confidence,
  className,
}: {
  confidence: number
  className?: string
}) {
  const severity: Severity =
    confidence < CONFIDENCE_THRESHOLD
      ? "degraded"
      : confidence < WARNING_THRESHOLD
        ? "warning"
        : "normal"

  if (severity === "normal") return null

  const config = {
    degraded: {
      icon: ShieldAlert,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      message:
        "AI confidence is low. Human review recommended before acting on recommendations.",
      sub: "Consider ground-truthing or waiting for updated imagery.",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50/80 border-amber-100",
      text: "text-amber-700",
      message:
        "AI confidence is moderate. Review estimates before making high-stakes decisions.",
      sub: null,
    },
  }[severity]

  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        config.bg,
        className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", config.text)} />
      <div>
        <p className={cn("text-sm font-medium", config.text)}>{config.message}</p>
        {config.sub && (
          <p className={cn("text-xs mt-0.5 opacity-90", config.text)}>
            {config.sub}
          </p>
        )}
      </div>
    </div>
  )
}
