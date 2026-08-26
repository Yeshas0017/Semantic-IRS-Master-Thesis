'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ onOpenApiKeyModal }: { onOpenApiKeyModal?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800/80">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider text-sky-400">SEMANTIC IRS LAB</h1>
          <span className="text-xs text-slate-500 font-mono">v2.4-thesis</span>
        </Link>

        {/* 3 Main Pages */}
        <nav className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition ${
              pathname === '/' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            01. Gatekeeper Lab
          </Link>
          <Link
            href="/analysis-hub"
            className={`px-3 py-1.5 rounded-lg transition ${
              pathname === '/analysis-hub' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            02. Analysis Hub
          </Link>
          <Link
            href="/benchmark"
            className={`px-3 py-1.5 rounded-lg transition ${
              pathname === '/benchmark' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            03. 100-Prompt Benchmark
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 text-xs font-mono rounded-lg transition"
          >
            🔑 API Gate Key
          </button>
        )}
        <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-right">
          <span className="text-[10px] text-slate-500 block uppercase font-mono">Cloud Run</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">us-central1</span>
        </div>
      </div>
    </header>
  );
}