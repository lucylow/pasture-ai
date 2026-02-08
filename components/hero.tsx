"use client"

import type React from "react"

import { PlayCircle, ChevronDown, Smartphone, Leaf } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="hero" className="pt-40 pb-24 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-[20%] left-[5%] w-[150px] h-[150px] rounded-full bg-light-green/10 animate-pulse" />
      <div
        className="absolute bottom-[20%] right-[10%] w-[120px] h-[120px] rounded-full bg-light-green/10 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-[1200px] mx-auto px-5 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-heading font-semibold text-4xl md:text-5xl lg:text-[3.5rem] leading-tight mb-5 text-dark-green text-balance">
            Real-Time Biomass Estimation for Sustainable Grazing
          </h1>
          <p className="text-lg text-text-light mb-8 text-pretty">
            PastureAI uses smartphone images and AI to help farmers optimize grazing, increase productivity, and promote
            sustainable land management—all in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-primary-green text-white px-8 py-3.5 rounded-full font-semibold hover:bg-dark-green transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Smartphone className="w-5 h-5" /> Try Demo App
            </Link>
            <a
              href="#app-demo"
              onClick={(e) => handleNavClick(e, "#app-demo")}
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-green text-primary-green px-8 py-3.5 rounded-full font-semibold hover:bg-primary-green hover:text-white transition-all hover:-translate-y-0.5"
            >
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </a>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 bg-light-green text-white px-4 py-2 rounded-full font-semibold text-sm">
            <Leaf className="w-4 h-4" /> Trusted by farmers worldwide for sustainable agriculture
          </div>
        </div>

        <div className="flex-1">
          <Image
            src="https://images.unsplash.com/photo-1547592188-4d6c77b78bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Farmer using PastureAI app in field"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </div>

      <a
        href="#problem"
        onClick={(e) => handleNavClick(e, "#problem")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-primary-green hover:text-dark-green transition-colors cursor-pointer group"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  )
}
