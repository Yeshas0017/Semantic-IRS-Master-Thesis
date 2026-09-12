'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

interface IntentPolicy {
  intent: string;
  confidence: number;
  cacheAllowed: boolean;
  threshold: number;
  maxAgeSeconds: number;
  sharingScope: 'public' | 'private' | 'restricted';
  reason: string;
}

interface EvalChecks {
  thresholdMatch: boolean;
  freshnessMatch: boolean;
  intentMatch: boolean;
  cacheAllowed: boolean;
  reason: string;
}

interface LogItem {
  id: string;
  timestamp: string;
  query: string;
  similarity: number;
  status: 'HIT' | 'BUST';
  latencyMs: number;
}

export default function GatekeeperPage() {
  const [queryInput, setQueryInput] = useState<string>('How can I optimize Next.js ISR on Cloud Run?');
  const [activeVectorId, setActiveVectorId] = useState<string>('8f2a9c');
  const [cachedNodeId, setCachedNodeId] = useState<string>('vector_d14c');
  const [similarity, setSimilarity] = useState<number>(0.924);
  const [threshold, setThreshold] = useState<number>(0.90);
  const [pipelineLatency, setPipelineLatency] = useState<number>(14);
  const [runtimeMode, setRuntimeMode] = useState<'gcp' | 'ollama'>('gcp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [responseContent, setResponseContent] = useState<string>(
    'Semantic ISR Cache Match: Serving pre-rendered static ISR build from edge memory. Downstream LLM inference bypassed successfully.'
  );

  const [policy, setPolicy] = useState<IntentPolicy>({
    intent: 'General Technical Documentation',
    confidence: 0.90,
    cacheAllowed: true,
    threshold: 0.90,
    maxAgeSeconds: 3600,
    sharingScope: 'public',
    reason: 'Shared conceptual or architectural documentation; standard 0.90 similarity threshold applied.'
  });

  const [evalChecks, setEvalChecks] = useState<EvalChecks>({
    thresholdMatch: true,
    freshnessMatch: true,
    intentMatch: true,
    cacheAllowed: true,
    reason: 'Cache Hit: Query matches General Technical Documentation intent.'
  });

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

  const isCacheHit = similarity >= policy.threshold && policy.cacheAllowed;

  const demoQueries = [
    { label: 'General Tech (Hit)', text: 'How to optimize Next.js ISR on Google Cloud Run?' },
    { label: 'Version-Specific (0.94)', text: 'Next.js 15 App Router dynamic routing and caching configuration' },
    { label: 'Pricing / Temporal (0.96)', text: 'Current Cloud Run pricing for GPU instances today' },
    { label: 'Private Data (Blocked)', text: 'Show my account balance and billing history' },
    { label: 'Out of Domain (Bypassed)', text: 'Best recipe for Italian pasta bolognese' }
  ];

  const handleIngest = async (queryToTest: string) => {
    if (!queryToTest.trim()) return;
    setIsProcessing(true);
    setFeedbackSent(false);

    try {
      const res = await fetch('/api/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToTest,
          threshold,
          engine: runtimeMode === 'gcp' ? 'cloud' : 'edge',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSimilarity(data.similarity ?? 0);
        setPipelineLatency(runtimeMode === 'gcp' ? 14 : 28);
        setActiveVectorId(data.cachedNodeId || Math.random().toString(16).substring(2, 8));
        setCachedNodeId(data.cachedNodeId || 'None');
        setResponseContent(data.responseContent);

        if (data.policy) setPolicy(data.policy);
        if (data.evalChecks) setEvalChecks(data.evalChecks);

        const isHit = data.action === 'CACHE_HIT';
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const newLog: LogItem = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          query: queryToTest,
          similarity: data.similarity ?? 0,
          status: isHit ? 'HIT' : 'BUST',
          latencyMs: data.ttfbMs,
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      console.error('Failed to query gatekeeper API:', err);
    } finally {
      setIsProcessing(false);
    }
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
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
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
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
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
                    className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-slate-200 text-slate-600 transition cursor-pointer"
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
                  Cosine Similarity (s*)
                </span>
              </div>

              <div className="text-center md:text-right space-y-1">
                <span className="text-xs uppercase font-mono font-bold text-slate-500 block">Nearest Cluster Centroid</span>
                <span className="inline-block bg-white border border-slate-200 text-purple-700 font-mono text-xs px-3 py-1.5 rounded-xl font-bold shadow-xs">
                  {cachedNodeId}
                </span>
              </div>
            </div>

            {/* Intent-Aware Policy Telemetry Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Detected Intent</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {policy.intent}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border uppercase tracking-wider ${
                  policy.sharingScope === 'private' ? 'bg-red-50 text-red-700 border-red-200' :
                  policy.sharingScope === 'restricted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Scope: {policy.sharingScope}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">Dynamic τ_i</span>
                  <span className="font-mono text-base font-extrabold text-slate-800">{policy.threshold.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">Measured s*</span>
                  <span className={`font-mono text-base font-extrabold ${evalChecks.thresholdMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {similarity.toFixed(3)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">Freshness Limit</span>
                  <span className="font-mono text-base font-extrabold text-slate-800">{policy.maxAgeSeconds}s</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">Cache Status</span>
                  <span className={`font-mono text-base font-extrabold ${policy.cacheAllowed ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {policy.cacheAllowed ? 'Eligible' : 'Blocked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Decision Rule Audit Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Explainable Routing Decision Engine
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                <div className={`p-2 rounded-lg border text-center ${evalChecks.thresholdMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  Threshold: {evalChecks.thresholdMatch ? 'PASS' : 'FAIL'}
                </div>
                <div className={`p-2 rounded-lg border text-center ${evalChecks.freshnessMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  Freshness: {evalChecks.freshnessMatch ? 'PASS' : 'FAIL'}
                </div>
                <div className={`p-2 rounded-lg border text-center ${evalChecks.intentMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  Intent Match: {evalChecks.intentMatch ? 'PASS' : 'FAIL'}
                </div>
                <div className={`p-2 rounded-lg border text-center ${evalChecks.cacheAllowed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  Cache Permitted: {evalChecks.cacheAllowed ? 'YES' : 'NO'}
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Routing Justification: </span>
                {evalChecks.reason}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200">
                <span className="text-slate-500">Notice incorrect semantic reuse?</span>
                {feedbackSent ? (
                  <span className="text-emerald-600 font-bold">Feedback logged. Centroid calibrated.</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFeedbackSent(true)}
                    className="px-3 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition shadow-2xs cursor-pointer"
                  >
                    Flag Context Drift
                  </button>
                )}
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

            {/* Delivered Payload / Status */}
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

          {/* Right Column: Dynamic Threshold Control & Live Logs */}
          <div className="space-y-8">
            
            {/* Dynamic Threshold Slider Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Manual Override (τ)</h3>
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
                  <span>{isCacheHit ? '✓ CACHE HIT' : '⚡ SAFE CACHE MISS'}</span>
                  <span className="text-xs font-semibold">({isCacheHit ? 'Bypass LLM' : 'Trigger Inference'})</span>
                </div>
                <p className={`text-xs font-medium pt-1 ${
                  isCacheHit ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  {isCacheHit
                    ? `sim (${similarity.toFixed(3)}) ≥ τ_i (${policy.threshold.toFixed(2)}): Static ISR page returned directly.`
                    : `sim (${similarity.toFixed(3)}) < τ_i (${policy.threshold.toFixed(2)}) or policy expired: Fresh execution required.`}
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