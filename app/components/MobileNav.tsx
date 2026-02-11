'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/#problem', label: 'Problem' },
  { href: '/#solution', label: 'Solution' },
  { href: '/#live-demo', label: 'Live Demo' },
  { href: '/#eco-tips', label: 'Eco Tips' },
  { href: '/#technical', label: 'Technical' },
  { href: '/demo', label: 'Demo App' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 mx-4 py-4 rounded-xl bg-white border border-slate-200 shadow-lg animate-fade-in-down">
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-slate-700 hover:bg-pasture-moss-50 hover:text-pasture-moss font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-2 mx-4 py-3 rounded-lg bg-pasture-moss text-white text-center font-semibold hover:bg-pasture-moss/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
