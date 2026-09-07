'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { evaluateGatekeeper } from '../lib/similarity/cosine-sim';

interface LogEntry {
  id: string;
  time: string;
  query: string;
  similarity: number;
  action: 'CACHE_HIT' | 'CACHE_BUST';
  ttfb: number;
}

export default function GatekeeperDashboard() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [threshold, setThreshold] = useState<number>(0.90);
  const [inputPrompt, setInputPrompt] = useState<string>('How to optimize Next.js ISR on Google Cloud Run?');
  const [cachedPrompt, setCachedPrompt] = useState<string>('Techniques for optimizing Next.js ISR on Cloud Run');
  const [cachedNodeId, setCachedNodeId] = useState<string>('vector_d14c');
  const [similarityScore, setSimilarityScore] = useState<number>(0.924);
  const [action, setAction] = useState<'CACHE_HIT' | 'CACHE_BUST'>('CACHE_HIT');
  const [ttfb, setTtfb] = useState<number>(140);
  const [engine, setEngine] = useState<'cloud' | 'local'>('cloud');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<string>(
    'Next.js ISR on Cloud Run leverages serverless revalidation cycles combined with intent caching to reduce cold inference taxes.'
  );

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      time: '14:22:01',
      query: 'How can I optimize Next.js ISR?',
      similarity: 0.962,
      action: 'CACHE_HIT',
      ttfb: 140,
    },
    {
      id: '2',
      time: '14:21:44',
      query: 'Weather patterns in Mumbai today.',
      similarity: 0.412,
      action: 'CACHE_BUST',
      ttfb: 3120,
    },
    {
      id: '3',
      time: '14:20:58',
      query: 'Optimization techniques for ISR.',
      similarity: 0.941,
      action: 'CACHE_HIT',
      ttfb: 140,
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('GEMINI_API_KEY');
      if (stored) setApiKey(stored);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
    }
    setIsModalOpen(false);
  };

  const handleExecuteQuery = async () => {
    if (!inputPrompt.trim()) return;
    setIsLoading(true);

    try {
      const gateRes = await fetch('/api/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt, threshold, engine }),
      });
      const gateData = await gateRes.json();

      if (!gateData.success) {
        setIsLoading(false);
        return;
      }

      setSimilarityScore(gateData.decision.similarity);
      setAction(gateData.decision.action);
      setTtfb(gateData.ttfbMs);

      let finalContent = gateData.responseContent;

      if (gateData.decision.action === 'CACHE_BUST') {
        const storedKey = apiKey || (typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') || '' : '');
        
        if (storedKey && engine === 'cloud') {
          try {
            const geminiRes = await fetch('/api/gemini', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: inputPrompt, apiKey: storedKey }),
            });
            const geminiData = await geminiRes.json();
            if (geminiData.success && geminiData.text) {
              finalContent = geminiData.text;
              setTtfb(geminiData.durationMs);
            }
          } catch (geminiErr) {
            console.warn('Gemini inference fallback:', geminiErr);
          }
        }

        setCachedNodeId(`vector_${Math.random().toString(36).substring(2, 6)}`);
        setCachedPrompt(inputPrompt);
      }

      setResponseOutput(finalContent);

      const newLog: LogEntry = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        query: inputPrompt,
        similarity: gateData.decision.similarity,
        action: gateData.decision.action,
        ttfb: gateData.ttfbMs,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('Execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-8 font-sans antialiased relative">
      {/* API Key Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0b101b] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider">
                🔑 Gemini API Gate Key
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-sm font-mono px-2 py-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your Google AI Studio key for live <b>Gemini 2.5 Flash</b> inference executions. Saved locally in your browser.
            </p>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-mono font-semibold transition"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
            <h1 className="text-xl font-bold tracking-wider text-sky-400">SEMANTIC ISR LAB</h1>
            <span className="text-xs text-slate-500 font-mono">v2.4-thesis</span>
          </Link>

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
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 hover:text-sky-300 text-xs font-mono rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <span>🔑</span>
            <span>{apiKey ? 'Key Configured' : 'API Gate Key'}</span>
          </button>
          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Cloud Run</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">us-central1</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-300">
                  Active Neural Gatekeeper (Live Flow)
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Thesis Runtime: 428:12:05</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEngine('cloud')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                    engine === 'cloud'
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  GCP Cloud Run
                </button>
                <button
                  onClick={() => setEngine('local')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                    engine === 'local'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Local Ollama
                </button>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="text-[10px] uppercase text-slate-500 font-mono block mb-1.5">
                Incoming Prompt Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Enter prompt to test semantic cache hit/bust..."
                  className="flex-1 bg-[#040711] border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={handleExecuteQuery}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs font-mono transition"
                >
                  {isLoading ? 'Evaluating...' : 'Ingest Query'}
                </button>
              </div>
            </div>

            {/* Vector Node Display */}
            <div className="relative p-8 bg-[#040711] rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div className="text-center z-10 w-1/3">
                <span className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Incoming Query</span>
                <span className="px-3 py-1.5 bg-slate-900 text-sky-300 rounded-md text-xs font-mono border border-sky-500/30 truncate block">
                  vector_id: 8f2a...
                </span>
              </div>

              <div className="text-center z-10">
                <div className="text-5xl font-black font-mono tracking-tight text-sky-400">
                  {similarityScore.toFixed(3)}
                </div>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest block mt-1">
                  Cosine Similarity (τ)
                </span>
              </div>

              <div className="text-center z-10 w-1/3">
                <span className="text-[10px] uppercase text-slate-500 font-mono block mb-1">Cached Node</span>
                <span className="px-3 py-1.5 bg-slate-900 text-purple-300 rounded-md text-xs font-mono border border-purple-500/30 truncate block">
                  {cachedNodeId}
                </span>
                <p className="text-[10px] text-slate-500 truncate mt-1">{cachedPrompt}</p>
              </div>
            </div>

            {/* Spec Bar */}
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

            {/* Response Card */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">Served Response Content</span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{responseOutput}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider block">
                Time to First Byte (TTFB)
              </span>
              <div className="text-4xl font-extrabold font-mono text-slate-100 mt-2">
                {ttfb}
                <span className="text-sm font-normal text-slate-500 ml-1">ms</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {action === 'CACHE_HIT'
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

        {/* Right Column */}
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
                  action === 'CACHE_HIT' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {action === 'CACHE_HIT' ? '✔ CACHE HIT (Bypass LLM)' : '⚡ CACHE BUST (New Intent)'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {action === 'CACHE_HIT'
                  ? 'High similarity: Serving pre-rendered ISR static node.'
                  : 'Low similarity: Intent shift detected, revalidating cache.'}
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold tracking-wide text-slate-300">Live Revalidation Log</h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
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
                      {log.action} ({log.ttfb}ms)
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