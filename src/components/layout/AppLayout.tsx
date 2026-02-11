import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Github } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home', isRoute: true },
  { href: '/dashboard', label: 'Dashboard', isRoute: true },
  { href: '/map', label: 'Map', isRoute: true },
  { href: '/community', label: 'Community', isRoute: true },
  { href: '/settings', label: 'Settings', isRoute: true },
]

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[hsl(var(--primary))]">
              Pasture<span className="text-[hsl(var(--foreground))]">AI</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="#cta"
              className="px-5 py-2 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[hsl(120,20%,10%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">PastureAI</span>
              </div>
              <p className="text-sm text-gray-400">
                Real-time biomass estimation for sustainable grazing management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#solution" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#app-demo" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#technical" className="hover:text-white transition-colors">Technical</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#eco-tips" className="hover:text-white transition-colors">Eco Tips</a></li>
                <li><a href="#problem" className="hover:text-white transition-colors">Research</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://github.com/lucylow/pasture-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
            © 2026 PastureAI. Built for CodeSpring Hackathon.
          </div>
        </div>
      </footer>
    </div>
  )
}
