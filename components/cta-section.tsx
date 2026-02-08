"use client"

import { Download, Github, Video, Mail, Smartphone } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const handleDownload = () => {
    alert("Download link will be available soon. Sign up for updates to get notified when the app is ready.")
  }

  const handleDemoVideo = () => {
    alert("Full product demo video coming soon. Subscribe to our newsletter for updates.")
  }

  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-primary-green to-dark-green text-white text-center">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2 className="font-heading font-semibold text-3xl md:text-4xl lg:text-5xl mb-5">
          Ready to Transform Your Pasture Management?
        </h2>
        <p className="text-lg max-w-[700px] mx-auto mb-10 opacity-90">
          Join thousands of farmers using AI-powered insights to optimize grazing, improve livestock health, and build
          sustainable agricultural practices.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-green px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Smartphone className="w-5 h-5" /> Try Demo App
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-primary-green transition-all hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" /> Download App
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-primary-green transition-all hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" /> View Source
          </a>
          <button
            onClick={handleDemoVideo}
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-primary-green transition-all hover:-translate-y-0.5"
          >
            <Video className="w-5 h-5" /> Watch Video
          </button>
        </div>

        <p className="mt-8 text-sm flex items-center justify-center gap-2 opacity-80">
          <Mail className="w-4 h-4" /> Questions? Contact us at contact@pastureai.tech
        </p>
      </div>
    </section>
  )
}
