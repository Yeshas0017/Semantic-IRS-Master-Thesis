'use client';

import React, { useState } from 'react';
import Navbar from '../../src/components/Navbar';
import ApiKeyModal from '../../src/components/ApiKeyModal';

export default function AnalysisHubPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-8 font-sans antialiased">
      <Navbar onOpenApiKeyModal={() => setIsModalOpen(true)} />
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKeySaved={() => {}}
      />

      <main className="max-w-7xl mx-auto mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            Performance Analysis & Empirical Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Benchmarking Cloud Run cold starts, inference taxes, and Core Web Vitals compliance.
          </p>
        </section>

        {/* 3 Strategy Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SSG */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-mono mb-4 text-slate-400">
              <span>VARIANT 01</span>
              <span className="text-emerald-400 font-bold">OPTIMAL</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">SSG</h3>
            <p className="text-xs text-slate-500 mt-1">Static Site Generation (Build-time)</p>

            <div className="mt-6 space-y-3 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Latency:</span>
                <span className="text-slate-200">223.07 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">P95 Latency:</span>
                <span className="text-slate-200">371.93 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Lighthouse Score:</span>
                <span className="text-emerald-400 font-bold">98 / 100</span>
              </div>
            </div>
          </div>

          {/* SSR */}
          <div className="p-6 bg-slate-900/40 border border-red-900/30 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-mono mb-4 text-slate-400">
              <span>VARIANT 02</span>
              <span className="text-red-400 font-bold">FAILING</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">SSR</h3>
            <p className="text-xs text-slate-500 mt-1">Server-Side (Synchronous Inference Tax)</p>

            <div className="mt-6 space-y-3 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Latency:</span>
                <span className="text-red-400">2,800.86 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">P95 Latency:</span>
                <span className="text-red-400">4,220.21 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Lighthouse Score:</span>
                <span className="text-red-400 font-bold">45 / 100</span>
              </div>
            </div>
          </div>

          {/* Semantic ISR */}
          <div className="p-6 bg-slate-900/40 border border-sky-900/40 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl">
              HERO ARCHITECTURE
            </div>
            <div className="flex justify-between items-center text-xs font-mono mb-4 text-slate-400">
              <span>VARIANT 03</span>
              <span className="text-sky-400 font-bold">EXCELLENT</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Semantic ISR</h3>
            <p className="text-xs text-slate-500 mt-1">Intent-Gated SWR Regeneration</p>

            <div className="mt-6 space-y-3 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Avg Latency:</span>
                <span className="text-sky-300 font-bold">188.45 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">P95 Latency:</span>
                <span className="text-sky-300 font-bold">285.41 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Lighthouse Score:</span>
                <span className="text-sky-400 font-bold">96 / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latency Breakdown Bar */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold tracking-wide text-slate-300">
            Core Web Vitals: Largest Contentful Paint (LCP) Comparison
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">SSR: 4,220ms (Synchronous Inference Tax)</span>
                <span className="text-red-400 font-bold">Poor (&gt;4.0s)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full w-[95%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">SSG: 371ms (Pre-rendered baseline)</span>
                <span className="text-emerald-400 font-bold">Good (&lt;2.5s)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full w-[12%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Semantic ISR: 285ms (Intent-Cached Response)</span>
                <span className="text-sky-400 font-bold">Good (&lt;2.5s)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-sky-500 h-2.5 rounded-full w-[8%]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}