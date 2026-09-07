'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';

interface LogItem {
  id: string;
  timestamp: string;
  query: string;
  similarity: number;
  status: 'HIT' | 'BUST';
  latencyMs: number;
}

export default function GatekeeperLabPage() {
  const [threshold, setThreshold] = useState<number>(0.90);
  const [queryInput, setQueryInput] = useState<string>('How to optimize Next.js ISR on Google Cloud Run?');
  const [runtimeMode, setRuntimeMode] = useState<'gcp' | 'ollama'>('gcp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Active query telemetry state
  const [activeVectorId, setActiveVectorId] = useState<string>('8f2a9c');
  const [cachedNodeId, setCachedNodeId] = useState<string>('vector_d14c');
  const [similarity, setSimilarity] = useState<number>(0.924);
  const [pipelineLatency, setPipelineLatency] = useState<number>(14);
  const [responseContent, setResponseContent] = useState<string>(
    'Next.js ISR on Cloud Run leverages serverless revalidation cycles combined with intent caching to eliminate cold inference latency.'
  );

  // Live log history
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'log-1',
      timestamp: '14:22:01',
      query: 'How can I optimize Next.js ISR?',
      similarity: 0.962,
      status: 'HIT',
      latencyMs: 140,
    },
    {
      id: 'log-2',
      timestamp: '14:21:44',
      query: 'Weather patterns in Mumbai today.',
      similarity: 0.412,
      status: 'BUST',
      latencyMs: 3120,
    },
    {
      id: 'log-3',
      timestamp: '14:18:10',
      query: 'ISR caching strategies on GCP container instances',
      similarity: 0.914,
      status: 'HIT',
      latencyMs: 132,
    },
  ]);

  // Derived Gatekeeper Verdict
  const isCacheHit = similarity >= threshold;

  // Preset query test cases for quick demoing
  const demoQueries = [
    { label: 'Exact Intent (Hit)', text: 'How to optimize Next.js ISR on Google Cloud Run?' },
    { label: 'Paraphrase (Hit)', text: 'Best practices for Next.js ISR caching on Cloud Run containers' },
    { label: 'Unrelated Intent (Bust)', text: 'Quantum computing algorithms in financial cryptography' },
  ];

  const handleIngest = (queryToTest: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      // Deterministic pseudo-similarity based on prompt text
      const lower = queryToTest.toLowerCase();
      let calculatedSim = 0.42;

      if (lower.includes('next.js') || lower.includes('isr') || lower.includes('caching') || lower.includes('cloud run')) {
        calculatedSim = lower.includes('optimize') ? 0.942 : 0.895;
      } else {
        calculatedSim = 0.38 + (queryToTest.length % 20) * 0.01;
      }

      const randomHash = Math.random().toString(16).substring(2, 8);
      const hit = calculatedSim >= threshold;
      const latency = hit ? Math.floor(110 + Math.random() * 40) : Math.floor(2600 + Math.random() * 600);

      setSimilarity(calculatedSim);
      setActiveVectorId(randomHash);
      setPipelineLatency(runtimeMode === 'gcp' ? 12 : 28);

      if (hit) {
        setResponseContent(
          'Semantic ISR Cache Match: Serving pre-rendered static ISR build from edge memory. Downstream LLM inference bypassed successfully.'
        );
      } else {
        setResponseContent(
          `Cache Invalidation Triggered (sim < ${threshold.toFixed(2)}): New prompt topology detected. Generating real-time response via ${
            runtimeMode === 'gcp' ? 'Vertex AI' : 'Ollama'
          } and revalidating ISR cache entry.`
        );
      }

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newLog: LogItem = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        query: queryToTest,
        similarity: calculatedSim,
        status: hit ? 'HIT' : 'BUST',
        latencyMs: latency,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
      setIsProcessing(false);
    }, 280);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16 antialiased selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Telemetry Panel (Left 2 Cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
            
            {/* Header / Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Active Neural Gatekeeper <span className="text-orange-500 font-bold">(Live Flow)</span>
                  </h2>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1 pl-5">
                  Thesis Monograph Testbed • Vertex AI / Ollama Inference Pipeline
                </p>
              </div>

              {/* Runtime Mode Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setRuntimeMode('gcp')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    runtimeMode === 'gcp'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  GCP Cloud Run
                </button>
                <button
                  type="button"
                  onClick={() => setRuntimeMode('ollama')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    runtimeMode === 'ollama'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Local Ollama
                </button>
              </div>
            </div>

            {/* Ingest Query Input & Quick Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-mono font-bold text-slate-500 tracking-wider">
                  Incoming Prompt Query
                </label>
                <span className="text-[11px] font-mono text-slate-400">Press Ingest to benchmark vector distance</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleIngest(queryInput)}
                  placeholder="Enter a dynamic natural language query..."
                  className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-900 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => handleIngest(queryInput)}
                  disabled={isProcessing}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md transition text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isProcessing ? 'Vectorizing...' : 'Ingest Query'}
                </button>
              </div>

              {/* Demo Query Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-400 mr-1">Presets:</span>
                {demoQueries.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQueryInput(chip.text);
                      handleIngest(chip.text);
                    }}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-slate-200 text-slate-600 transition"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Vector Distance Telemetry */}
            <div className={`grid grid-cols-1 md:grid-cols-3 items-center gap-4 rounded-2xl p-6 border transition-all ${
              isCacheHit ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-rose-50/30 border-rose-200/80'
            }`}>
              <div className="text-center md:text-left space-y-1">
                <span className="text-xs uppercase font-mono font-bold text-slate-500 block">Incoming Vector</span>
                <span className="inline-block bg-white border border-slate-200 text-indigo-700 font-mono text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs">
                  {`vector_${activeVectorId}`}
                </span>
              </div>

              <div className="text-center">
                <span className={`text-6xl font-black font-mono tracking-tight transition-colors ${
                  isCacheHit ? 'text-emerald-600' : 'text-rose-500'
                }`}>
                  {similarity.toFixed(3)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-widest mt-1 block">
                  Cosine Similarity (τ)
                </span>
              </div>

              <div className="text-center md:text-right space-y-1">
                <span className="text-xs uppercase font-mono font-bold text-slate-500 block">Nearest Cluster Centroid</span>
                <span className="inline-block bg-white border border-slate-200 text-purple-700 font-mono text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs">
                  {cachedNodeId}
                </span>
              </div>
            </div>

            {/* Spec Cards Triplet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-sky-50/60 border border-sky-200/70 p-4 rounded-2xl">
                <span className="text-[11px] uppercase font-mono font-bold text-sky-700 block">Embedding Backend</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {runtimeMode === 'gcp' ? 'Vertex AI (text-embedding-004)' : 'Ollama (nomic-embed-text)'}
                </span>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/70 p-4 rounded-2xl">
                <span className="text-[11px] uppercase font-mono font-bold text-amber-700 block">Latent Dimensions</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">768 (L2 Normalized)</span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-2xl">
                <span className="text-[11px] uppercase font-mono font-bold text-emerald-700 block">Gatekeeper Overhead</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-1 block">~{pipelineLatency}ms</span>
              </div>
            </div>

            {/* Response Content Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono font-bold text-slate-500 block">
                  Delivered Payload / Invalidation Status
                </span>
                <span className="text-[11px] font-mono text-slate-400">HTTP 200 OK</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {responseContent}
              </p>
            </div>
          </div>

          {/* Right Column: Threshold Control & Live Logs */}
          <div className="space-y-8">
            
            {/* Dynamic Threshold Slider Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Threshold Control (τ)</h3>
                  <p className="text-xs font-mono text-slate-400">Strictness boundary</p>
                </div>
                <span className="text-3xl font-black font-mono text-amber-500">
                  {threshold.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0.80"
                  max="0.95"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold">
                  <span>0.80 (Aggressive)</span>
                  <span>0.85</span>
                  <span>0.90</span>
                  <span>0.95 (Conservative)</span>
                </div>
              </div>

              {/* Dynamic Gatekeeper Action Result */}
              <div className={`border-2 rounded-2xl p-5 space-y-1 transition-all ${
                isCacheHit
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-rose-50/80 border-rose-300'
              }`}>
                <span className={`text-[11px] uppercase font-mono font-bold block ${
                  isCacheHit ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  Gatekeeper Decision
                </span>
                <div className={`text-base font-black flex items-center gap-2 ${
                  isCacheHit ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  <span>{isCacheHit ? '✓ CACHE HIT' : '⚡ CACHE BUST'}</span>
                  <span className="text-xs font-semibold">({isCacheHit ? 'Bypass LLM' : 'Trigger Inference'})</span>
                </div>
                <p className={`text-xs font-medium pt-1 ${
                  isCacheHit ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {isCacheHit
                    ? `sim (${similarity.toFixed(3)}) ≥ τ (${threshold.toFixed(2)}): Static ISR page returned directly.`
                    : `sim (${similarity.toFixed(3)}) < τ (${threshold.toFixed(2)}): Intent drift detected. Revalidating.`}
                </p>
              </div>
            </div>

            {/* Live Revalidation Feed */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Live Revalidation Log</h3>
                  <p className="text-xs font-mono text-slate-400">Streamed event buffer</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`border rounded-2xl p-3.5 space-y-1 transition-all ${
                      log.status === 'HIT'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                          log.status === 'HIT'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {log.status === 'HIT' ? `CACHE_HIT (${log.latencyMs}ms)` : `CACHE_BUST (${log.latencyMs}ms)`}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{log.query}</p>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      similarity score: {log.similarity.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}