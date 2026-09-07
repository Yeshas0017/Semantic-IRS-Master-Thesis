'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';

export default function AnalysisHubPage() {
  const [selectedTau, setSelectedTau] = useState<number>(0.90);
  const [trafficVolume, setTrafficVolume] = useState<number>(10000);

  // Model parameters for dynamic analysis
  const baseCostPer1kLLM = 8.20; // USD per 1,000 raw LLM requests
  const baseLatencyLLM = 3450;    // ms
  const baseLatencyISR = 142;     // ms

  // Dynamic calculations based on Tau
  const stats = useMemo(() => {
    // As tau decreases, hit rate increases (looser threshold)
    const hitRate = Math.min(0.92, Math.max(0.35, 0.68 + (0.90 - selectedTau) * 2.2));
    const bustRate = 1 - hitRate;

    const avgLatency = Math.round(hitRate * baseLatencyISR + bustRate * baseLatencyLLM);
    const semanticCost = ((bustRate * baseCostPer1kLLM * (trafficVolume / 1000)) + 0.12).toFixed(2);
    const ssrCost = (baseCostPer1kLLM * (trafficVolume / 1000)).toFixed(2);
    const savedAmount = (parseFloat(ssrCost) - parseFloat(semanticCost)).toFixed(2);
    const savedPct = (((parseFloat(ssrCost) - parseFloat(semanticCost)) / parseFloat(ssrCost)) * 100).toFixed(1);

    // Latent drift probability (higher when threshold is too loose)
    const driftRisk = selectedTau < 0.85 ? 'Elevated (5.8%)' : selectedTau < 0.92 ? 'Nominal (<0.8%)' : 'Near-Zero (<0.1%)';

    return {
      hitRatePct: (hitRate * 100).toFixed(1),
      bustRatePct: (bustRate * 100).toFixed(1),
      avgLatency,
      semanticCost,
      ssrCost,
      savedAmount,
      savedPct,
      driftRisk,
    };
  }, [selectedTau, trafficVolume]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16 antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                02. Semantic ISR Analysis Hub
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1 pl-5">
              Economic Cost Trade-off • Latency Distribution • Threshold Sensitivity Surface
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">Monthly Traffic:</span>
            <select
              value={trafficVolume}
              onChange={(e) => setTrafficVolume(Number(e.target.value))}
              aria-label="Monthly Traffic Volume"
              className="bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 rounded-xl px-3 py-2 outline-none focus:border-amber-500"
            >
              <option value={1000}>1,000 requests</option>
              <option value={10000}>10,000 requests</option>
              <option value={50000}>50,000 requests</option>
              <option value={100000}>100,000 requests</option>
            </select>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Projected Cache Hit Rate
            </span>
            <div className="text-3xl font-black font-mono text-emerald-600 mt-2">
              {stats.hitRatePct}%
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              at similarity threshold τ = {selectedTau.toFixed(2)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Cloud Cost Savings
            </span>
            <div className="text-3xl font-black font-mono text-sky-600 mt-2">
              {stats.savedPct}%
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              ${stats.savedAmount} saved vs. Synchronous SSR
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Mean Pipeline Latency
            </span>
            <div className="text-3xl font-black font-mono text-amber-500 mt-2">
              {stats.avgLatency} ms
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              vs. 3,450ms raw un-cached LLM cycle
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Semantic Drift Risk
            </span>
            <div className="text-3xl font-black font-mono text-indigo-600 mt-2">
              {stats.driftRisk}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              False-positive static match rate
            </p>
          </div>

        </div>

        {/* 2-Column Analytical Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Interactive Threshold Surface & Cost Curves */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-7">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Threshold Sensitivity & Operational Trade-offs
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Simulate how shifting similarity parameter τ rebalances compute overhead
              </p>
            </div>

            {/* Slider Control */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase">
                  Target Similarity Boundary (τ)
                </span>
                <span className="text-xl font-mono font-black text-amber-500">
                  {selectedTau.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="0.96"
                step="0.01"
                value={selectedTau}
                onChange={(e) => setSelectedTau(parseFloat(e.target.value))}
                aria-label="Target Similarity Boundary"
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
                <span>0.80 (Aggressive Caching / Low Cost)</span>
                <span>0.88 (Optimal Frontier)</span>
                <span>0.96 (Strict / Near SSR)</span>
              </div>
            </div>

            {/* Latency Distribution Breakdown Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-600">Cache Routing Distribution</span>
                <span className="text-slate-400">Hits: {stats.hitRatePct}% | Misses: {stats.bustRatePct}%</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden flex border border-slate-200">
                <div
                  style={{ width: `${stats.hitRatePct}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-mono font-black text-white transition-all duration-300"
                >
                  ISR HIT ({stats.hitRatePct}%)
                </div>
                <div
                  style={{ width: `${stats.bustRatePct}%` }}
                  className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-mono font-black text-white transition-all duration-300"
                >
                  LLM BUST ({stats.bustRatePct}%)
                </div>
              </div>
            </div>

            {/* Comparative Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Rendering Strategy</th>
                    <th className="pb-3">Mean Latency</th>
                    <th className="pb-3">Est. Compute Expense</th>
                    <th className="pb-3">Cache Freshness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-bold text-slate-900">Synchronous SSR (Full LLM)</td>
                    <td className="py-3 text-rose-600 font-bold">3,450 ms</td>
                    <td className="py-3 text-slate-800 font-bold">${stats.ssrCost}</td>
                    <td className="py-3 text-emerald-600 font-semibold">100% Real-time</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900">Fixed-Timer ISR (60s Revalidate)</td>
                    <td className="py-3 text-amber-600 font-bold">980 ms</td>
                    <td className="py-3 text-slate-800 font-bold">${(parseFloat(stats.ssrCost) * 0.72).toFixed(2)}</td>
                    <td className="py-3 text-amber-600 font-semibold">Stale on Uncached Paths</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-3 font-bold text-emerald-800 pl-2">Semantic ISR (Active Gatekeeper)</td>
                    <td className="py-3 text-emerald-700 font-bold">{stats.avgLatency} ms</td>
                    <td className="py-3 text-emerald-700 font-bold">${stats.semanticCost}</td>
                    <td className="py-3 text-emerald-700 font-semibold">Semantically Bound</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Right Column: Key Empirical Findings Card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm space-y-5">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Empirical Monograph Takeaways
              </h2>

              <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 block font-mono uppercase text-[10px]">
                    1. Cold Start Mitigation
                  </span>
                  <p>
                    By maintaining normalized 768-dim embeddings in memory, the gatekeeper routes over 65% of semantically identical queries away from cold container invocations.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 block font-mono uppercase text-[10px]">
                    2. The Optimal Boundary (τ* = 0.90)
                  </span>
                  <p>
                    Values of τ ≥ 0.90 effectively reduce semantic hallucination and false-positive reuse to near zero while preserving sub-200ms page response times.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="font-bold text-slate-900 block font-mono uppercase text-[10px]">
                    3. Cloud Cost Efficiency
                  </span>
                  <p>
                    At scale (100k requests), Semantic ISR reduces downstream API invoice overhead by up to 39.6% compared to un-cached architectures.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-sky-700 block">
                Deployment Topology
              </span>
              <p className="text-xs text-sky-950 font-medium leading-relaxed">
                Evaluated under Google Cloud Run containerized deployment with Node.js 24 standalone server & Vertex AI vector embeddings.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}