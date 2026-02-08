"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Leaf, Menu, X, ChevronUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "#problem", label: "Problem", id: "problem" },
  { href: "#solution", label: "Solution", id: "solution" },
  { href: "#app-demo", label: "Live Demo", id: "app-demo" },
  { href: "#tips", label: "Eco Tips", id: "tips" },
  { href: "#technical", label: "Technical", id: "technical" },
]

export function Header() {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isLandingPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    )

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [isLandingPage])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

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
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/98 py-2.5 shadow-md backdrop-blur-sm" : "bg-white/95 py-4 shadow-sm"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-2xl text-dark-green">
              Pasture<span className="text-light-green">AI</span>
            </span>
          </Link>

          <button
            className="md:hidden text-dark-green text-2xl p-2 rounded-lg hover:bg-lighter-green/50 transition-colors relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {isLandingPage &&
              navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-medium transition-colors relative group py-2 ${
                    activeSection === link.id ? "text-primary-green" : "text-text-dark hover:text-primary-green"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary-green transition-all ${
                      activeSection === link.id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              ))}
            <Link
              href="/demo"
              className={`font-medium transition-colors relative group py-2 ${
                pathname === "/demo" ? "text-primary-green" : "text-text-dark hover:text-primary-green"
              }`}
            >
              Demo App
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-primary-green transition-all ${
                  pathname === "/demo" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
            {isLandingPage ? (
              <a
                href="#cta"
                onClick={(e) => handleNavClick(e, "#cta")}
                className="bg-primary-green text-white px-6 lg:px-8 py-3 rounded-full font-semibold hover:bg-dark-green transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get Started
              </a>
            ) : (
              <Link
                href="/#cta"
                className="bg-primary-green text-white px-6 lg:px-8 py-3 rounded-full font-semibold hover:bg-dark-green transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>

        <div
          className={`fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ top: 0 }}
        />

        <nav
          className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl md:hidden transition-transform duration-300 ease-out z-40 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col pt-20 px-6">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <span className="text-sm text-text-light">Navigation</span>
            </div>
            {isLandingPage &&
              navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`py-4 border-b border-gray-50 font-medium transition-all flex items-center justify-between ${
                    activeSection === link.id
                      ? "text-primary-green"
                      : "text-text-dark hover:text-primary-green hover:pl-2"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)",
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                  {activeSection === link.id && <span className="w-2 h-2 rounded-full bg-primary-green" />}
                </a>
              ))}
            <Link
              href="/demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-4 border-b border-gray-50 font-medium transition-all flex items-center justify-between ${
                pathname === "/demo" ? "text-primary-green" : "text-text-dark hover:text-primary-green hover:pl-2"
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${navLinks.length * 50}ms` : "0ms",
                transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)",
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              Demo App
              {pathname === "/demo" && <span className="w-2 h-2 rounded-full bg-primary-green" />}
            </Link>
            {isLandingPage ? (
              <a
                href="#cta"
                onClick={(e) => handleNavClick(e, "#cta")}
                className="mt-6 bg-primary-green text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-dark-green transition-all"
                style={{
                  transitionDelay: isMobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : "0ms",
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
              >
                Get Started
              </a>
            ) : (
              <Link
                href="/#cta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 bg-primary-green text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-dark-green transition-all"
                style={{
                  transitionDelay: isMobileMenuOpen ? `${(navLinks.length + 1) * 50}ms` : "0ms",
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </header>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary-green text-white rounded-full shadow-lg flex items-center justify-center hover:bg-dark-green transition-all duration-300 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </>
  )
}
