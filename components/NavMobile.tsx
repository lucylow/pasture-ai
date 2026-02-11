'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NavMobile() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden relative">
      <button type="button" onClick={() => setOpen(!open)} className="px-3 py-2 bg-slate-100 rounded">
        Menu
      </button>
      {open && (
        <div className="mt-2 p-3 bg-white rounded-xl shadow-lg border border-slate-200 absolute right-0 top-full z-50 min-w-[180px]">
          <Link href="/" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/community" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>Community</Link>
          <Link href="/paddocks" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>My Paddocks</Link>
          <Link href="/cooperative" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>Cooperative</Link>
          <Link href="/demo" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>Demo</Link>
          <Link href="/kpis" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>KPIs</Link>
          <Link href="/about" className="block py-2 px-2 text-slate-700 hover:text-pasture-moss font-medium" onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </div>
  );
}
