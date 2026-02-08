const techStack = [
  {
    icon: "🐍",
    title: "AI Model",
    description: "Based on CSIRO's Image2Biomass research using SigLIP/DINOv2 embeddings",
    features: ["Computer Vision", "Transfer Learning", "On-device Inference"],
  },
  {
    icon: "⚛️",
    title: "Frontend",
    description: "React Native for cross-platform mobile app with offline capabilities",
    features: ["Progressive Web App", "TensorFlow.js", "Real-time Analytics"],
  },
  {
    icon: "🖥️",
    title: "Backend",
    description: "Scalable cloud API for community features and data synchronization",
    features: ["Cloud Integration", "Secure Authentication", "Data Analytics"],
  },
]

const features = [
  {
    title: "Offline-First Architecture",
    description: "Full functionality without internet connectivity, syncing when available",
  },
  {
    title: "Multi-Platform Support",
    description: "Available on iOS, Android, and web browsers for maximum accessibility",
  },
  {
    title: "Real-Time Processing",
    description: "On-device AI inference for instant biomass predictions without server delays",
  },
  {
    title: "Enterprise Security",
    description: "End-to-end encryption and secure data handling for farm data protection",
  },
]

export function TechnicalSection() {
  return (
    <section id="technical" className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-dark-green relative inline-block pb-4">
            Technical Implementation
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-light-green rounded-sm" />
          </h2>
          <p className="text-text-light mt-4 max-w-xl mx-auto">
            Built with cutting-edge technology for reliability and performance
          </p>
        </div>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-5xl mb-4">{tech.icon}</div>
              <h3 className="font-heading font-semibold text-xl text-dark-green mb-3">{tech.title}</h3>
              <p className="text-text-light mb-4">{tech.description}</p>
              <ul className="text-left">
                {tech.features.map((feature, j) => (
                  <li key={j} className="py-2 border-b border-gray-100 last:border-0 text-text-light text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="font-heading font-semibold text-2xl text-dark-green text-center mb-8">
            Key Technical Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((feature, i) => (
              <div key={i} className="bg-lighter-green/30 p-6 rounded-xl">
                <h4 className="font-heading font-semibold text-dark-green mb-2">{feature.title}</h4>
                <p className="text-text-light text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
