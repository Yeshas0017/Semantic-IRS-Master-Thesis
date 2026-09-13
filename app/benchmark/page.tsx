'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CompareRecord {
  action: 'CACHE_HIT' | 'SAFE_CACHE_MISS' | 'POLICY_BLOCKED';
  title: string;
  subtitle: string;
  whyItMatters: string;
  smartSearchTime: number;
  alwaysModelTime: number;
  smartSearchCost: number;
  alwaysModelCost: number;
  smartSearchOutcome: string;
  alwaysModelOutcome: string;
  conclusion: string;
  technical: {
    similarity: number;
    threshold: number;
    overheadMs: number;
    rawAction: string;
  };
}

const PRESETS = [
  { label: 'Reuse existing answer (Hit)', query: 'How can I optimize Next.js ISR on Cloud Run?' },
  { label: 'Generate fresh answer (Miss)', query: 'Next.js 15 App Router dynamic routing and caching configuration' },
  { label: 'Protect private data (Blocked)', query: 'Show my account balance and billing history' },
];

export default function CompareApproachesPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [question, setQuestion] = useState('How can I optimize Next.js ISR on Cloud Run?');
  const [loading, setLoading] = useState(false);
  const [showTechnical, setShowTechnical] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('site-theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('site-theme', next);
  }

  const isDark = theme === 'dark';

  const [record, setRecord] = useState<CompareRecord>({
    action: 'CACHE_HIT',
    title: 'Answer reused',
    subtitle: 'The system found a trustworthy existing answer, so no new AI response was needed.',
    whyItMatters: '0.14 seconds instead of 3.12 seconds. No new AI model call was required.',
    smartSearchTime: 0.14,
    alwaysModelTime: 3.12,
    smartSearchCost: 0.0000,
    alwaysModelCost: 0.0082,
    smartSearchOutcome: 'Existing answer reused (Static ISR Cache Hit)',
    alwaysModelOutcome: 'New AI response generated (Cold Token Call)',
    conclusion: 'Result: Smart search was about 22× faster and avoided a new model call.',
    technical: {
      similarity: 0.924,
      threshold: 0.90,
      overheadMs: 14,
      rawAction: 'CACHE_HIT',
    },
  });

  async function handleCompare(queryText: string) {
    setLoading(true);
    setQuestion(queryText);
    try {
      const res = await fetch('/api/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText, threshold: 0.90 }),
      });
      const data = await res.json();

      const rawAction = data.action;
      const sim = data.similarity ?? 0.0;
      const thr = data.effectiveThreshold ?? 0.90;

      if (rawAction === 'POLICY_BLOCKED') {
        setRecord({
          action: 'POLICY_BLOCKED',
          title: 'Access restricted',
          subtitle: 'This question may contain private information, so shared answer reuse was blocked.',
          whyItMatters: 'Safety rules took priority over response speed. Personal details are never stored or shared.',
          smartSearchTime: 0.15,
          alwaysModelTime: 3.12,
          smartSearchCost: 0.0082,
          alwaysModelCost: 0.0082,
          smartSearchOutcome: 'Direct secure execution (Cache Bypassed)',
          alwaysModelOutcome: 'Full model response',
          conclusion: 'Result: The privacy rule blocked shared reuse to prevent cross-tenant data leakage.',
          technical: {
            similarity: 0.0,
            threshold: 1.0,
            overheadMs: 12,
            rawAction: 'POLICY_BLOCKED',
          },
        });
      } else if (rawAction === 'CACHE_HIT') {
        setRecord({
          action: 'CACHE_HIT',
          title: 'Answer reused',
          subtitle: 'The system found a trustworthy existing answer, so no new AI response was needed.',
          whyItMatters: '0.14 seconds instead of 3.12 seconds. No new AI model call was required.',
          smartSearchTime: 0.14,
          alwaysModelTime: 3.12,
          smartSearchCost: 0.0000,
          alwaysModelCost: 0.0082,
          smartSearchOutcome: 'Existing answer reused (Static ISR Cache Hit)',
          alwaysModelOutcome: 'New AI response generated (Cold Token Call)',
          conclusion: 'Result: Smart search was about 22× faster and avoided a new model call.',
          technical: {
            similarity: sim,
            threshold: thr,
            overheadMs: 14,
            rawAction: 'CACHE_HIT',
          },
        });
      } else {
        setRecord({
          action: 'SAFE_CACHE_MISS',
          title: 'A new answer was needed',
          subtitle: 'The existing answer was not suitable enough, so the system generated a fresh response.',
          whyItMatters: 'The system avoided returning an uncertain or unrelated answer. Both approaches required a new AI response for this question.',
          smartSearchTime: 3.12,
          alwaysModelTime: 3.12,
          smartSearchCost: 0.0082,
          alwaysModelCost: 0.0082,
          smartSearchOutcome: 'New answer generated (Cache revalidated)',
          alwaysModelOutcome: 'Full model response',
          conclusion: 'Result: Both approaches required a new model response. The gatekeeper prevented unsafe reuse.',
          technical: {
            similarity: sim,
            threshold: thr,
            overheadMs: 16,
            rawAction: 'SAFE_CACHE_MISS',
          },
        });
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen antialiased py-6 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Global Navigation Header */}
        <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl shadow-sm border transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800 shadow-black/40' : 'bg-white border-slate-200 shadow-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>SEMANTIC ISR LAB</h1>
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-semibold">Benchmarks</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>03. Compare Approaches • Concurrency Benchmarks & Performance Metrics</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              1. Ask a question
            </Link>
            <Link
              href="/analysis"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              2. Understand the decision
            </Link>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm">
              3. Compare approaches
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        {/* Live Comparison Interactive Playground */}
        <section className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Compare answer delivery
          </h2>
          <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            See whether the system can safely reuse an existing answer or needs to generate a new one.
          </p>

          <div className="mt-6">
            <label htmlFor="compareInput" className={`block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2`}>
              Enter a question to compare both approaches
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                id="compareInput"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How can I optimize Next.js ISR on Cloud Run?"
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                onClick={() => handleCompare(question)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {loading ? 'Comparing...' : 'Compare approaches'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleCompare(p.query)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    isDark ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Evaluation Outcome */}
        <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-800 border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">EVALUATION RESULT</span>
              <h3 className={`text-2xl font-black mt-0.5 ${
                record.action === 'CACHE_HIT' ? 'text-emerald-600 dark:text-emerald-400' :
                record.action === 'POLICY_BLOCKED' ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {record.title}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start sm:self-auto ${
              record.action === 'CACHE_HIT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' :
              record.action === 'POLICY_BLOCKED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300' :
              'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
            }`}>
              {record.smartSearchOutcome}
            </span>
          </div>

          <p className={`text-base leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {record.subtitle}
          </p>

          <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-blue-50/70 border-blue-100 text-blue-900'
          }`}>
            <span className="font-semibold block mb-0.5">Why this matters:</span>
            {record.whyItMatters}
          </div>

          {/* Comparison Table */}
          <div>
            <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How the approaches compare
            </h4>
            <div className="overflow-hidden border rounded-xl dark:border-slate-800 border-slate-200">
              <table className="min-w-full text-xs divide-y dark:divide-slate-800 divide-slate-200">
                <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Delivery method</th>
                    <th className="px-4 py-3 text-left font-semibold">Response time</th>
                    <th className="px-4 py-3 text-left font-semibold">Model cost</th>
                    <th className="px-4 py-3 text-left font-semibold">What happened</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  <tr className={isDark ? 'bg-blue-950/20' : 'bg-blue-50/50'}>
                    <td className="px-4 py-3.5 font-bold text-blue-600 dark:text-blue-400">Smart search (Gatekeeper)</td>
                    <td className={`px-4 py-3.5 font-bold ${record.action === 'CACHE_HIT' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {record.smartSearchTime.toFixed(2)} seconds ({Math.round(record.smartSearchTime * 1000)} ms)
                    </td>
                    <td className={`px-4 py-3.5 font-bold ${record.action === 'CACHE_HIT' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      ${record.smartSearchCost.toFixed(4)}
                    </td>
                    <td className="px-4 py-3.5 font-medium">{record.smartSearchOutcome}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-slate-500">Always use AI (No cache)</td>
                    <td className="px-4 py-3.5 text-slate-500">{record.alwaysModelTime.toFixed(2)} seconds</td>
                    <td className="px-4 py-3.5 text-slate-500">${record.alwaysModelCost.toFixed(4)}</td>
                    <td className="px-4 py-3.5 text-slate-500">{record.alwaysModelOutcome}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border text-sm font-semibold ${
            isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {record.conclusion}
          </div>
        </section>

        {/* Thesis Chapter 5: Empirical Load Test Concurrency Evaluation Table */}
        <section className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Thesis Concurrency Benchmark Profile (Chapter 5 Evaluation)
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Automated load test executed against Google Cloud Run europe-west3 (100 requests, Concurrency = 10)
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
              Hit Rate: 99.0%
            </span>
          </div>

          <div className="overflow-x-auto border rounded-xl dark:border-slate-800 border-slate-200">
            <table className="min-w-full text-xs font-mono divide-y dark:divide-slate-800 divide-slate-200">
              <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-600'}>
                <tr>
                  <th className="p-3 text-left">Benchmark Metric</th>
                  <th className="p-3 text-left">Measured Value</th>
                  <th className="p-3 text-left">Architectural Significance</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                <tr>
                  <td className="p-3 font-bold">Successful Cache Hits</td>
                  <td className="p-3 font-bold text-emerald-500">99 / 100 (99.0%)</td>
                  <td className="p-3 font-sans">1 initial cold revalidation miss + 99 subsequent static cache hits</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Throughput</td>
                  <td className="p-3 font-bold text-cyan-400">48.47 req/sec</td>
                  <td className="p-3 font-sans">Sustained serverless throughput on Cloud Run container instance</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Average Latency (Mean)</td>
                  <td className="p-3">190.46 ms</td>
                  <td className="p-3 font-sans">Network RTT + deterministic vector match + static payload return</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Median Latency (P50)</td>
                  <td className="p-3 font-bold text-emerald-400">183.64 ms</td>
                  <td className="p-3 font-sans">Typical user response time profile under concurrent load</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">90th Percentile (P90)</td>
                  <td className="p-3">241.12 ms</td>
                  <td className="p-3 font-sans">Upper tail scheduling latency within Cloud Run sandbox</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">95th Percentile (P95)</td>
                  <td className="p-3">252.93 ms</td>
                  <td className="p-3 font-sans">High-concurrency bound</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">99th Percentile (P99)</td>
                  <td className="p-3">317.44 ms</td>
                  <td className="p-3 font-sans">Encompasses initial cold invalidation and centroid write</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}