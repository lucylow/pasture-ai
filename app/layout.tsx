import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import NavMobile from '@/components/NavMobile';

export const metadata: Metadata = {
  title: 'PastureAI Demo · Lovable.dev',
  description: 'Multi-page demo frontend for PastureAI, ready for Lovable Cloud.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/80 backdrop-blur border-b">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-pasture-moss rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">PA</span>
                </div>
                <span className="font-semibold text-lg">PastureAI</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">Home</Link>
                <Link href="/community" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">Community</Link>
                <Link href="/paddocks" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">My Paddocks</Link>
                <Link href="/cooperative" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">Cooperative</Link>
                <Link href="/demo" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">Demo</Link>
                <Link href="/kpis" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">KPIs</Link>
                <Link href="/about" className="text-sm text-slate-600 hover:text-pasture-moss font-medium">About</Link>
              </nav>
              <NavMobile />
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 py-12">{children}</div>
          </main>

          <footer className="border-t bg-white">
            <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-500 text-center">
              Demo frontend for PastureAI · Built for Lovable.dev · © {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
