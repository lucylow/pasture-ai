import { PastureAIDemoUI } from "@/components/pasture-ai-demo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PastureAI Demo - Real-time Biomass Analysis",
  description: "Try the PastureAI demo to analyze pasture images and get biomass estimations in real-time.",
}

export default function DemoPage() {
  return <PastureAIDemoUI />
}
