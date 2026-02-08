"use client"

import { useState, useEffect } from "react"

const sections = [
  { id: "hero", label: "Home" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "app-demo", label: "Demo" },
  { id: "tips", label: "Eco Tips" },
  { id: "technical", label: "Tech" },
  { id: "cta", label: "Contact" },
]

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 },
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
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
    <nav
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => handleClick(section.id)}
          className="group flex items-center gap-2"
          aria-label={`Go to ${section.label}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              activeSection === section.id
                ? "bg-primary-green scale-125"
                : "bg-gray-300 group-hover:bg-light-green group-hover:scale-110"
            }`}
          />
          <span
            className={`text-xs font-medium transition-all whitespace-nowrap ${
              activeSection === section.id
                ? "text-primary-green opacity-100 translate-x-0"
                : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
          >
            {section.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
