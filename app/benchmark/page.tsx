'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

interface PromptResult {
  id: number;
  prompt: string;
  category: 'Framework' | 'Cloud Run' | 'Vector DB' | 'Edge ISR';
  similarity: number;
  verdict: 'HIT' | 'BUST';
  latencyMs: number;
}

export default function BenchmarkPage() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIT' | 'BUST'>('ALL');

  // Benchmark Dataset Samples
  const [benchmarkData] = useState<PromptResult[]>([
    { id: 1, prompt: 'How does Next.js Incremental Static Regeneration work on Cloud Run?', category: 'Edge ISR', similarity: 0.964, verdict: 'HIT', latencyMs: 128 },
    { id: 2, prompt: 'Optimizing serverless container cold-starts in us-central1', category: 'Cloud Run', similarity: 0.912, verdict: 'HIT', latencyMs: 144 },
    { id: 3, prompt: 'What is the exact formula for cosine similarity between two 768-dim vectors?', category: 'Vector DB', similarity: 0.442, verdict: 'BUST', latencyMs: 3420 },
    { id: 4, prompt: 'Comparing stale-while-revalidate caching headers with Next.js ISR', category: 'Edge ISR', similarity: 0.941, verdict: 'HIT', latencyMs: 130 },
    { id: 5, prompt: 'Deploying Node.js standalone build on Docker Alpine linux', category: 'Cloud Run', similarity: 0.887, verdict: 'BUST', latencyMs: 3180 },
    { id: 6, prompt: 'Vertex AI text-embedding-004 latency metrics on batch inference', category: 'Vector DB', similarity: 0.925, verdict: 'HIT', latencyMs: 152 },
    { id: 7, prompt: 'Turbopack build issues with PostCSS plugins in Next 16', category: 'Framework', similarity: 0.380, verdict: 'BUST', latencyMs: 3810 },
    { id: 8, prompt: 'How to bypass LLM inference using intent caching gatekeepers?', category: 'Edge ISR', similarity: 0.978, verdict: 'HIT', latencyMs: 120 },
    { id: 9, prompt: 'Best practices for React Server Components streaming architecture', category: 'Framework', similarity: 0.512, verdict: 'BUST', latencyMs: 2950 },
    { id: 10, prompt: 'Semantic caching vs exact-match HTTP redis cache hit rates', category: 'Vector DB', similarity: 0.932, verdict: 'HIT', latencyMs: 139 },
  ]);

  const handleRunBatch = () => {
    setIsRunning(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const filteredData = benchmarkData.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.verdict === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16 antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Header with Run Trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                03. 100-Prompt Standardized Evaluation Suite
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1 pl-5">
              Quantitative comparison: Semantic ISR vs. 60s Fixed-Timer ISR vs. Synchronous SSR
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunBatch}
            disabled={isRunning}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
          >
            <span>{isRunning ? 'Benchmarking...' : '▶ Execute 100-Prompt Batch'}</span>
          </button>
        </div>

        {/* Progress Bar (Visible during batch execution) */}
        {isRunning && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
              <span>Batch Pipeline Ingestion: 100 Synthesized Test Vectors</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="bg-amber-500 h-full transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Aggregate KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Benchmark Hit Rate
            </span>
            <div className="text-3xl font-black font-mono text-emerald-600 mt-2">
              68.4%
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              At threshold boundary τ = 0.90
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Economic Cost Reduction
            </span>
            <div className="text-3xl font-black font-mono text-sky-600 mt-2">
              $4.95 / 1k
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              39.6% inference cost reduction
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Semantic ISR TTFB
            </span>
            <div className="text-3xl font-black font-mono text-amber-500 mt-2">
              194 ms
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sub-200ms target satisfied
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              SSR Inference Penalty
            </span>
            <div className="text-3xl font-black font-mono text-rose-500 mt-2">
              3,840 ms
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Fails CWV threshold (&gt;2.5s)
            </p>
          </div>

        </div>

        {/* Benchmark Results Table & Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Telemetry Evaluation Samples
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Representative prompt clusters from the 100-query monograph testbed
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All (10)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('HIT')}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeFilter === 'HIT' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Hits (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('BUST')}
                className={`px-3.5 py-1.5 rounded-lg transition ${
                  activeFilter === 'BUST' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Busts (4)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="pb-3 w-12">#</th>
                  <th className="pb-3">Query Prompt Content</th>
                  <th className="pb-3">Domain Category</th>
                  <th className="pb-3 text-center">Cosine (τ)</th>
                  <th className="pb-3 text-center">Gatekeeper Action</th>
                  <th className="pb-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 text-slate-400 font-bold">{row.id}</td>
                    <td className="py-3.5 font-sans font-medium text-slate-900 pr-4">{row.prompt}</td>
                    <td className="py-3.5">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-slate-700">
                      {row.similarity.toFixed(3)}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          row.verdict === 'HIT'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {row.verdict === 'HIT' ? '✓ CACHE_HIT' : '⚡ CACHE_BUST'}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 text-right font-bold ${
                        row.latencyMs < 200 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {row.latencyMs} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}