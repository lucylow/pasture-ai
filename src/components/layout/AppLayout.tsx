import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/map', label: 'Map' },
  { to: '/community', label: 'Community' },
  { to: '/settings', label: 'Settings' },
]

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[hsl(142,40%,33%)] flex items-center justify-center text-white font-bold text-sm">PA</div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">PastureAI</h1>
              <p className="text-xs text-gray-500">Mock multi-page frontend</p>
            </div>
          </div>
          <nav className="flex gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-full text-sm transition-colors ${
                    isActive
                      ? 'bg-[hsl(142,40%,33%)] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>
      <footer className="border-t py-4 text-center text-xs text-gray-400">
        PastureAI © 2026 • Mock demo only
      </footer>
    </div>
  )
}
