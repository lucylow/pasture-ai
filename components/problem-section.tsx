import { XCircle, DollarSign, Clock, TrendingUp } from "lucide-react"
import Image from "next/image"

const problems = [
  {
    icon: XCircle,
    title: "Overgrazing & Land Degradation",
    description:
      "Inaccurate estimates lead to overgrazing, causing soil erosion and reduced long-term pasture productivity.",
  },
  {
    icon: DollarSign,
    title: "Increased Feed Costs",
    description: "Underestimating biomass forces farmers to purchase expensive supplemental feed unnecessarily.",
  },
  {
    icon: Clock,
    title: "Labor-Intensive Methods",
    description: 'Traditional "clip and weigh" methods take hours per pasture and don\'t scale for larger operations.',
  },
  {
    icon: TrendingUp,
    title: "Limited Technology Access",
    description:
      "Advanced solutions like satellite imaging are expensive and require technical expertise beyond most farmers.",
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-muted">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-dark-green relative inline-block pb-4">
            The Problem We're Solving
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-light-green rounded-sm" />
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="font-heading font-semibold text-2xl md:text-3xl text-dark-green mb-5">
              Farmers Struggle to Estimate Pasture Biomass Accurately
            </h2>
            <p className="text-text-light mb-8">
              Current methods for estimating pasture biomass are either inaccurate, time-consuming, or inaccessible to
              small and medium-sized farms. This leads to inefficient grazing practices that harm both farm productivity
              and the environment.
            </p>

            <ul className="space-y-5">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-4">
                  <problem.icon className="w-6 h-6 text-destructive mt-1 shrink-0" />
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-dark-green mb-1">{problem.title}</h3>
                    <p className="text-text-light">{problem.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <Image
              src="https://images.unsplash.com/photo-1500384066616-8a8b0a6d6c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Overgrazed pasture problem"
              width={600}
              height={400}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
