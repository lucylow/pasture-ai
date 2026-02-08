import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ImpactBanner } from "@/components/impact-banner"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { LiveDemoSection } from "@/components/live-demo-section"
import { EcologicalTipsSection } from "@/components/ecological-tips-section"
import { TechnicalSection } from "@/components/technical-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SectionNav } from "@/components/section-nav"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <SectionNav />
      <Hero />
      <ImpactBanner />
      <ProblemSection />
      <SolutionSection />
      <LiveDemoSection />
      <EcologicalTipsSection />
      <TechnicalSection />
      <CTASection />
      <Footer />
    </main>
  )
}
