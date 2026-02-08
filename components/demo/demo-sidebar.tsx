"use client"

import Link from "next/link"
import {
  Leaf,
  Upload,
  History,
  Info,
  Settings,
  Home,
  Menu,
  X,
  Beef,
} from "lucide-react"
import type { Screen } from "./demo-types"

const navItems: { id: Screen; label: string; icon: typeof Upload; shortcut?: string }[] = [
  { id: "upload", label: "Analyze", icon: Upload, shortcut: "Alt+U" },
  { id: "livestock", label: "Livestock", icon: Beef, shortcut: "Alt+L" },
  { id: "history", label: "History", icon: History, shortcut: "Alt+H" },
  { id: "info", label: "Model Info", icon: Info },
  { id: "settings", label: "Settings", icon: Settings },
]

export function DemoSidebar({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (s: Screen) => void
}) {
  return (
    <nav
      className="w-[260px] border-r border-demo-border hidden md:flex flex-col bg-demo-surface"
      aria-label="Primary"
    >
      <div className="p-5 pb-6 border-b border-demo-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-demo-accent rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Leaf className="w-[18px] h-[18px]" />
          </div>
          <div>
            <span className="font-heading font-semibold text-[15px] text-demo-text leading-none">
              Pasture<span className="text-demo-accent">AI</span>
            </span>
            <p className="text-[11px] text-demo-text-secondary mt-0.5 leading-tight">Biomass Analysis</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 p-3">
        <p className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase tracking-wider text-demo-text-secondary">
          Navigation
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 text-[13px] transition-all ${
                  screen === item.id
                    ? "bg-demo-accent-light text-demo-accent font-medium"
                    : "text-demo-text-secondary hover:bg-demo-surface-warm hover:text-demo-text"
                }`}
                aria-current={screen === item.id ? "page" : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[10px] text-demo-text-secondary/60 font-mono">{item.shortcut}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 border-t border-demo-border">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-[13px] text-demo-text-secondary hover:text-demo-accent rounded-lg hover:bg-demo-accent-light transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </nav>
  )
}

export function MobileHeader({
  mobileMenuOpen,
  onToggleMenu,
}: {
  mobileMenuOpen: boolean
  onToggleMenu: () => void
}) {
  return (
    <header className="md:hidden px-4 py-3 border-b border-demo-border flex items-center justify-between bg-demo-surface sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-demo-accent rounded-lg flex items-center justify-center text-white">
          <Leaf className="w-4 h-4" />
        </div>
        <span className="font-heading font-semibold text-[15px] text-demo-text">
          Pasture<span className="text-demo-accent">AI</span>
        </span>
      </Link>
      <button
        className="p-2 rounded-lg hover:bg-demo-surface-warm transition-colors text-demo-text-secondary"
        onClick={onToggleMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </header>
  )
}

export function MobileMenu({
  open,
  screen,
  onNavigate,
  onClose,
}: {
  open: boolean
  screen: Screen
  onNavigate: (s: Screen) => void
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-demo-text/40 backdrop-blur-sm" onClick={onClose}>
      <nav
        className="absolute top-0 right-0 w-[280px] h-full bg-demo-surface p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-14 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-sm ${
                screen === item.id
                  ? "bg-demo-accent-light text-demo-accent font-medium"
                  : "text-demo-text-secondary hover:bg-demo-surface-warm"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-demo-border mt-3 pt-3">
            <Link
              href="/"
              className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-sm text-demo-text-secondary hover:bg-demo-surface-warm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
