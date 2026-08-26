'use client';

import React, { useState } from 'react';
import { evaluateGatekeeper } from '../lib/similarity/cosine-sim';

interface LogEntry {
  id: string;
  time: string;
  query: string;
  similarity: number;
  action: 'CACHE_HIT' | 'CACHE_BUST';
}

export default function GatekeeperDashboard() {
  const [threshold, setThreshold] = useState<number>(0.90);
  const [currentScore, setCurrentScore] = useState<number>(0.924);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      time: '14:22:01',
      query: 'How can I optimize Next.js ISR?',
      similarity: 0.962,
      action: 'CACHE_HIT',
    },
    {
      id: '2',
      time: '14:21:44',
      query: 'Weather patterns in Mumbai today.',
      similarity: 0.412,
      action: 'CACHE_BUST',
    },
    {
      id: '3',
      time: '14:20:58',
      query: 'Optimization techniques for ISR.',
      similarity: 0.941,
      action: 'CACHE_HIT',
    },
  ]);

  const decision = evaluateGatekeeper(currentScore, threshold);

  const simulateIngestion = () => {
    const randomSim = parseFloat((0.70 + Math.random() * 0.28).toFixed(3));
    setCurrentScore(randomSim);

    const isHit = randomSim >= threshold;
    const newLog: LogEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      query: isHit
        ? 'Best caching patterns for Google Cloud Run'
        : 'Compare PostgreSQL vs MongoDB for high write loads',
      similarity: randomSim,
      action: isHit ? 'CACHE_HIT' : 'CACHE_BUST',
    };

    setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-8 font-sans antialiased">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wider text-sky-400">SEMANTIC ISR LAB</h1>
          <span className="text-xs text-slate-500 font-mono">v2.4.0-stable</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">System Health</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">99.8% NOMINAL</span>
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Model Drift</span>
            <span className="text-xs font-bold text-purple-400 font-mono">0.02% STABLE</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-300">
                  Active Neural Gatekeeper (Live Flow)
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Thesis Runtime: 428:12:05</p>
              </div>
              <span className="text-xs text-sky-400 font-mono bg-sky-950/60 border border-sky-800/50 px-2.5 py-1 rounded-full">
                Processing 84 q/s
              </span>
            </div>

            {/* Vector Node Display */}
            <div className="relative p-10 bg-[#040711] rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div className="text-center z-10">
                <span className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Incoming Query</span>
                <span className="px-3 py-1.5 bg-slate-900 text-sky-300 rounded-md text-xs font-mono border border-sky-500/30">
                  vector_id: 8f2a...
                </span>
              </div>

              <div className="text-center z-10">
                <div className="text-5xl font-black font-mono tracking-tight text-sky-400">
                  {decision.similarity.toFixed(3)}
                </div>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest block mt-1">
                  Similarity Score (τ)
                </span>
              </div>

              <div className="text-center z-10">
                <span className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Cached Node</span>
                <span className="px-3 py-1.5 bg-slate-900 text-purple-300 rounded-md text-xs font-mono border border-purple-500/30">
                  vector_id: d14c...
                </span>
              </div>
            </div>

            {/* Spec Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800/50 rounded-lg">
                <span className="text-slate-500 block text-[10px] uppercase">Embedding Engine</span>
                <span className="font-mono font-medium text-slate-200">Vertex AI (text-embedding-004)</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800/50 rounded-lg">
                <span className="text-slate-500 block text-[10px] uppercase">Latent Dimensions</span>
                <span className="font-mono font-medium text-slate-200">768 (Normalized)</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800/50 rounded-lg">
                <span className="text-slate-500 block text-[10px] uppercase">Pipeline Latency</span>
                <span className="font-mono font-medium text-emerald-400">12ms avg</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider block">
                Time to First Byte (TTFB)
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-100 mt-2">
                {decision.action === 'CACHE_HIT' ? '140' : '3200'}
                <span className="text-sm font-normal text-slate-500 ml-1">ms</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {decision.action === 'CACHE_HIT'
                  ? '⚡ 22.8x faster via intent-aware cache'
                  : '⏳ LLM cold start inference triggered'}
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider block">
                Lighthouse Target Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-2">98</div>
              <p className="text-xs text-slate-400 mt-2">Exceeds &gt;95 web vitals benchmark threshold</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <h2 className="text-sm font-semibold tracking-wide text-slate-300 mb-4">
              Threshold Control (τ)
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center font-mono">
                <span className="text-xs text-slate-400">Selected Threshold:</span>
                <span className="text-xl font-bold text-sky-400">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="0.95"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.80 (Loosest)</span>
                <span>0.85</span>
                <span>0.90</span>
                <span>0.95 (Strict)</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#040711] border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-mono mb-1">Gatekeeper Action</span>
              <div
                className={`text-base font-bold font-mono ${
                  decision.action === 'CACHE_HIT' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {decision.action === 'CACHE_HIT' ? '✔ CACHE HIT (Bypass LLM)' : '⚡ CACHE BUST (New Intent)'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {decision.action === 'CACHE_HIT'
                  ? 'High similarity: Serving pre-rendered ISR static node.'
                  : 'Low similarity: Intent shift detected, revalidating cache.'}
              </p>
            </div>

            <button
              onClick={simulateIngestion}
              className="mt-6 w-full py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl font-semibold text-xs transition duration-150 shadow-lg shadow-sky-950/40"
            >
              Simulate Ingestion Request
            </button>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold tracking-wide text-slate-300">Live Revalidation Log</h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                STREAMING
              </span>
            </div>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#040711] border border-slate-800/60 rounded-xl flex flex-col gap-1 font-mono text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        log.action === 'CACHE_HIT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-300 truncate font-sans text-xs mt-0.5">{log.query}</p>
                  <span className="text-[10px] text-slate-500">sim: {log.similarity.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}