/**
 * Model Card panel — regulatory-friendly AI disclosure.
 */
import { modelCard } from "@/mock"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export function AIModelCardPanel() {
  return (
    <div className="rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-[#2C2C2A]/60" />
        <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider">
          Model Card
        </h4>
      </div>
      <p className="text-sm font-medium text-[#2C2C2A] mb-1">{modelCard.name}</p>
      <p className="text-sm text-[#2C2C2A]/80 mb-3">{modelCard.intendedUse}</p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="limitations" className="border-none">
          <AccordionTrigger className="py-1 text-xs font-medium text-[#2C2C2A]/80 hover:no-underline">
            Limitations
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc list-inside text-xs text-[#2C2C2A]/70 space-y-0.5">
              {modelCard.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ethics" className="border-none">
          <AccordionTrigger className="py-1 text-xs font-medium text-[#2C2C2A]/80 hover:no-underline">
            Ethics & Governance
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-[#2C2C2A]/70">{modelCard.ethicalConsiderations}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="policy" className="border-none">
          <AccordionTrigger className="py-1 text-xs font-medium text-[#2C2C2A]/80 hover:no-underline">
            Update Policy
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-xs text-[#2C2C2A]/70">{modelCard.updatePolicy}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Badge variant="secondary" className="mt-2 text-[10px]">
        Regulatory disclosure
      </Badge>
    </div>
  )
}
