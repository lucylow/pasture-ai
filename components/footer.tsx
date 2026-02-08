"use client"

import type React from "react"
import { Twitter, Facebook, Instagram, Linkedin, Github, Mail, MapPin, ChevronRight, Code } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { href: "#problem", label: "The Problem" },
  { href: "#solution", label: "Our Solution" },
  { href: "#app-demo", label: "Live Demo" },
  { href: "#tips", label: "Eco Tips" },
  { href: "#technical", label: "Technical Details" },
  { href: "/demo", label: "Demo App", isPage: true },
]

const resourceLinks = [
  { href: "#cta", label: "Get Started" },
  { href: "https://github.com", label: "GitHub Repository", external: true },
  { href: "#", label: "Documentation", external: true },
  { href: "#", label: "API Reference", external: true },
]

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
]

const hackathonLinks = [
  { href: "#", label: "Hackathon Link 1" },
  { href: "#", label: "Hackathon Link 2" },
]

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("http") || href.startsWith("/")) return // Allow external and page links

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
    <footer className="bg-dark-green text-white pt-20 pb-8">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 relative pb-2.5">
              PastureAI
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-light-green" />
            </h3>
            <p className="text-white/80 mb-5">
              Real-time biomass estimation for sustainable grazing. Empowering farmers with AI technology.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-light-green transition-all hover:-translate-y-0.5 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 relative pb-2.5">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-light-green" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {"isPage" in link && link.isPage ? (
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-light-green hover:pl-2 transition-all inline-flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-white/80 hover:text-light-green hover:pl-2 transition-all inline-flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 relative pb-2.5">
              Resources
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-light-green" />
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    target={"external" in link && link.external ? "_blank" : undefined}
                    rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                    className="text-white/80 hover:text-light-green hover:pl-2 transition-all inline-flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-xl mb-6 relative pb-2.5">
              Contact
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-light-green" />
            </h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2 hover:text-light-green transition-colors">
                <Mail className="w-4 h-4" /> contact@pastureai.tech
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Global - Remote First
              </li>
            </ul>
            <p className="mt-5 text-white/70 text-sm">
              Empowering farmers with AI technology for sustainable agriculture.
            </p>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 mb-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {quickLinks.map((link) =>
              "isPage" in link && link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-white/70 text-sm">
          <p>© 2026 PastureAI. All rights reserved.</p>
          <p className="mt-2">Built with love for sustainable agriculture and farmer communities worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
