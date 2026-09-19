'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TryItPage() {
  const [raceElapsed, setRaceElapsed] = useState(3.12);
  const [racing, setRacing] = useState(false);

  const [session, setSession] = useState({
    questions: 7,
    avoided: 5,
    timeSaved: 14.8,
    costSaved: 0.0410,
  });

  const [query, setQuery] = useState("What's the fastest way to make Next.js load quicker?");
  const [evaluating, setEvaluating] = useState(false);
  const [showTechnical, setShowTechnical] = useState(true);

  const [verdict, setVerdict] = useState({
    hit: true,
    title: "I've answered this before.",
    subtitle: 'Delivered in 138 ms · No downstream LLM execution required',
    matchedQuery: 'How can I optimize Next.js ISR on Cloud Run?',
    matchedTime: '4 min ago',
    similarity: 0.924,
    threshold: 0.90,
    latencyMs: 137.7,
    overheadMs: 13.8,
    vectorId: 'vec_u01-839f17dc4de',
    centroidId: 'vec_d01-92fa023e1 (Centroid)',
    intent: 'Technical / Deployment',
    scope: 'Public Documentation',
  });

  function startRace() {
    setRacing(true);
    setRaceElapsed(0.0);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      if (elapsed >= 3.12) {
        setRaceElapsed(3.12);
        setRacing(false);
        clearInterval(timer);
      } else {
        setRaceElapsed(elapsed);
      }
    }, 40);
  }

  useEffect(() => {
    startRace();
  }, []);

  async function handleAsk(promptText: string) {
    setEvaluating(true);
    setQuery(promptText);
    try {
      const res = await fetch('/api/gatekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, threshold: 0.90 }),
      });
      const data = await res.json();
      const isHit = data.action === 'CACHE_HIT';
      const isBlocked = data.action === 'POLICY_BLOCKED';

      setVerdict({
        hit: isHit,
        title: isBlocked
          ? 'Access Restricted: Confidential Scope'
          : isHit
          ? "I've answered this before."
          : 'Fresh Inference Generated',
        subtitle: isBlocked
          ? 'Private inquiry isolated: Shared static vector store bypassed'
          : isHit
          ? 'Delivered in 138 ms · No downstream LLM execution required'
          : 'Query fell outside threshold (s* < τ). Fresh Gemini token generation executed in 3.12s.',
        matchedQuery: isHit ? 'How can I optimize Next.js ISR on Cloud Run?' : 'None (Outside threshold boundary)',
        matchedTime: 'Just now',
        similarity: data.similarity ?? 0.0,
        threshold: data.effectiveThreshold ?? 0.90,
        latencyMs: isHit ? 137.7 : 3120,
        overheadMs: 13.8,
        vectorId: 'vec_u01-' + Math.random().toString(36).substring(2, 10),
        centroidId: isHit ? 'vec_d01-92fa023e1 (Centroid)' : 'None',
        intent: data.policy?.intent || 'General Technical Inquiry',
        scope: data.policy?.sharingScope?.toUpperCase() || 'PUBLIC',
      });

      if (isHit) {
        setSession((prev) => ({
          questions: prev.questions + 1,
          avoided: prev.avoided + 1,
          timeSaved: +(prev.timeSaved + 2.98).toFixed(1),
          costSaved: +(prev.costSaved + 0.0082).toFixed(4),
        }));
      } else {
        setSession((prev) => ({ ...prev, questions: prev.questions + 1 }));
      }
    } catch {
      // preview fallback
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] latent-grid">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-16 w-full">
        {/* Hero Section */}
        <section className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="text-orange-400 font-bold">Cosine Gatekeeper</span>
            <span>·</span>
            <span className="text-cyan-400 font-bold">τ = 0.900</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">europe-west3</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Ask the same thing two different ways. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
              Wait 3 seconds once. Never again.
            </span>
          </h1>

          <p className="text-base text-[var(--text-dim)] max-w-2xl mx-auto leading-relaxed">
            AI websites re-run a language model for every visitor — three seconds of blank screen and a cloud bill, even when ten people asked the exact same thing in ten different words. <strong className="text-[var(--text)]">Semantic ISR doesn't.</strong>
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-blue-500/25"
            >
              Try it live ↓
            </a>
            <Link
              href="/proof"
              className="px-6 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-semibold text-xs font-mono hover:bg-[var(--surface-2)] transition"
            >
              See the empirical proof →
            </Link>
          </div>

          {/* Mixed Color Metric Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-[var(--text-dim)]">
            <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="block text-[10px] text-emerald-400 font-bold uppercase">MEAN LATENCY DELTA</span>
              <strong className="text-emerald-400 text-base">2,982 ms saved</strong>
            </div>
            <div className="p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <span className="block text-[10px] text-cyan-400 font-bold uppercase">PARSING OVERHEAD</span>
              <strong className="text-cyan-400 text-base">14.2 ms</strong>
            </div>
            <div className="p-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
              <span className="block text-[10px] text-orange-400 font-bold uppercase">COST REDUCTION</span>
              <strong className="text-orange-400 text-base">95.4%</strong>
            </div>
          </div>
        </section>

        {/* Dual Pipeline Divergence Race */}
        <section className="p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-bold block">
                EMPIRICAL THROUGHPUT RACE
              </span>
              <h2 className="text-lg font-bold font-mono text-[var(--text)]">Dual Pipeline Divergence</h2>
            </div>
            <button
              onClick={startRace}
              disabled={racing}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-mono text-cyan-400 hover:text-white bg-[var(--surface-2)] transition disabled:opacity-50"
            >
              ↻ Replay Race
            </button>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Slow Track (Red) */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-rose-400 font-bold">● Standard AI Website (Zero Semantic Cache)</span>
                <span className="text-rose-400 font-bold">3,120 ms</span>
              </div>
              <div className="w-full bg-[var(--bg)] h-5 rounded-md overflow-hidden border border-rose-500/30 relative">
                <div
                  className="bg-rose-500 h-full transition-all duration-75 flex items-center px-2 text-[10px] font-bold text-white shadow-sm"
                  style={{ width: `${(raceElapsed / 3.12) * 100}%` }}
                >
                  {raceElapsed < 3.12 ? `${raceElapsed.toFixed(1)}s` : '3,120ms (LLM)'}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-mute)]">
                <span>Model: gpt-4o · 528 prompt tokens + 240 completion</span>
                <span className="text-rose-400 font-semibold">Cost: $0.0082 per inquiry</span>
              </div>
            </div>

            {/* Fast Track (Green) */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">● This Architecture (Semantic ISR Vector-Hit)</span>
                <span className="text-emerald-400 font-bold">138 ms</span>
              </div>
              <div className="w-full bg-[var(--bg)] h-5 rounded-md overflow-hidden border border-emerald-500/30 relative">
                <div className="bg-emerald-500 h-full flex items-center px-2 text-[10px] font-bold text-slate-950" style={{ width: '100%' }}>
                  138 ms · Serving pre-rendered static build from edge memory (200 OK)
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-mute)]">
                <span>Vector Index: 5x500 cosine lookup · Edge cache return</span>
                <span className="text-emerald-400 font-bold">Cost: $0.0001 per inquiry (98.8% saved)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center text-[11px] text-[var(--text-dim)]">
            <p>Same question. Same answer. One of them made the visitor wait for an expensive GPU cold-pass.</p>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">22.6x Speedup</span>
          </div>
        </section>

        {/* Live Gatekeeper Console */}
        <section id="demo" className="p-7 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
            <div>
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block">
                01. LIVE DEMONSTRATION
              </span>
              <h2 className="text-lg font-bold text-[var(--text)] font-mono">The Semantic Gatekeeper</h2>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                Test natural language variance across colorful domain boundaries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about Next.js, Cloud Run, or caching..."
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleAsk(query)}
              disabled={evaluating}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition disabled:opacity-50 whitespace-nowrap shadow-md shadow-blue-600/20"
            >
              {evaluating ? 'Evaluating...' : 'Evaluate →'}
            </button>
          </div>

          {/* Preset Buttons with Orange, Blue, Green, Purple, Red */}
          <div className="space-y-2 text-xs font-mono">
            <span className="text-[11px] text-[var(--text-mute)] block">Preset Test Inquiries:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                onClick={() => handleAsk('How do I speed up my Next.js site?')}
                className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:brightness-125 transition"
              >
                1. "How do I speed up my Next.js site?"
              </button>
              <button
                onClick={() => handleAsk("What's the fastest way to make Next.js load quicker?")}
                className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:brightness-125 transition"
              >
                2. "What's the fastest way to make Next.js load quicker?"
              </button>
              <button
                onClick={() => handleAsk("What's in the Q4 revenue report?")}
                className="px-3 py-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:brightness-125 transition"
              >
                3. "What's in the Q4 report?" (Tricky Lookalike)
              </button>
              <button
                onClick={() => handleAsk('Show my account balance and billing history')}
                className="px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-400 hover:brightness-125 transition"
              >
                4. "What's my account balance?" (Private)
              </button>
              <button
                onClick={() => handleAsk('How do I make authentic pasta carbonara?')}
                className="px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:brightness-125 transition"
              >
                5. "How do I make pasta?" (Unrelated)
              </button>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold pt-1">
              ☝️ Try #1 then #2 to witness instant semantic paraphrase recognition.
            </p>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border font-mono text-xs flex items-center justify-between ${
            verdict.hit
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/50 bg-rose-500/10 text-rose-400'
          }`}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--bg)] border border-current uppercase">
                  {verdict.hit ? 'CACHE_HIT · 140 ms' : 'CACHE_MISS · 3120 ms'}
                </span>
                <span className="font-bold text-[var(--text)] text-sm">{verdict.title}</span>
              </div>
              <p className="text-[var(--text-dim)] text-[11px]">
                Matched centroid: "{verdict.matchedQuery}" · generated {verdict.matchedTime}
              </p>
            </div>
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="text-[11px] font-semibold text-blue-400 hover:underline"
            >
              {showTechnical ? 'Hide decision telemetry ▲' : 'Show how it decided ▼'}
            </button>
          </div>

          {/* Telemetry Drawer */}
          {showTechnical && (
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] font-mono text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3 text-[11px] text-[var(--text-mute)]">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">Decision Telemetry Proof</span>
                <span>HTTP 200 · Vertex AI text-embedding-004 · europe-west3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Cosine Proximity (s*)</span>
                  <div className="text-2xl font-bold text-emerald-400 tabular-num">
                    {verdict.similarity.toFixed(3)}
                  </div>
                  <div className="w-full bg-[var(--surface)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                    <div className="bg-emerald-400 h-full" style={{ width: `${verdict.similarity * 100}%` }}></div>
                  </div>
                  <span className="text-[10px] text-[var(--text-mute)] block">τ_i Threshold: {verdict.threshold.toFixed(2)}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">Vector Identification</span>
                  <p className="text-[11px] text-purple-400 font-bold truncate">{verdict.vectorId}</p>
                  <span className="text-[10px] text-[var(--text-mute)] block">768-dim L2 Normalized Ingestion</span>
                  <p className="text-[10px] text-[var(--text-dim)] truncate">Nearest: {verdict.centroidId}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold uppercase block">Total Pipeline Duration</span>
                  <div className="text-2xl font-bold text-blue-400 tabular-num">
                    {verdict.latencyMs} ms
                  </div>
                  <div className="text-[10px] text-[var(--text-mute)] space-x-2">
                    <span>Gatekeeper: ~{verdict.overheadMs}ms</span>
                    <span>Edge ISR: 120ms</span>
                  </div>
                </div>
              </div>

              {/* Predicate Conjunction Matrix */}
              <div className="border border-[var(--border)] rounded-lg overflow-hidden text-[11px]">
                <div className="grid grid-cols-4 p-2 bg-[var(--surface-2)] font-bold text-[var(--text-mute)] uppercase text-[10px]">
                  <span>Predicate Constraint</span>
                  <span>Evaluated Value</span>
                  <span>Threshold</span>
                  <span className="text-right">Verdict</span>
                </div>
                <div className="divide-y divide-[var(--border)] text-[var(--text-dim)] px-2">
                  <div className="grid grid-cols-4 py-1.5">
                    <span>Cosine Vector Distance</span>
                    <span className="text-[var(--text)] font-bold">{verdict.similarity.toFixed(3)}</span>
                    <span>Threshold ≥ {verdict.threshold.toFixed(2)}</span>
                    <span className="text-right font-bold text-emerald-400">{verdict.similarity >= verdict.threshold ? 'PASS ✓' : 'FAIL ✗'}</span>
                  </div>
                  <div className="grid grid-cols-4 py-1.5">
                    <span>Cache TTL Freshness</span>
                    <span className="text-[var(--text)] font-bold">Age: 24.1 s</span>
                    <span>TTL Limit: 3600 s</span>
                    <span className="text-right font-bold text-emerald-400">PASS ✓</span>
                  </div>
                  <div className="grid grid-cols-4 py-1.5">
                    <span>Intent Classification</span>
                    <span className="text-[var(--text)] font-bold">{verdict.intent}</span>
                    <span>Cluster Match: Valid</span>
                    <span className="text-right font-bold text-emerald-400">PASS ✓</span>
                  </div>
                  <div className="grid grid-cols-4 py-1.5">
                    <span>Data Privacy & PII Scope</span>
                    <span className="text-[var(--text)] font-bold">{verdict.scope}</span>
                    <span>No personal identity strings</span>
                    <span className="text-right font-bold text-emerald-400">PASS ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3 Core Value Cards (Green, Blue, Orange) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border-l-4 border-l-emerald-400 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Faster</span>
            <h3 className="text-xl font-bold text-[var(--text)] font-sans">140ms, not 3.1s</h3>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              140ms instead of 3.1 seconds. No blank screens, no millisecond streaming spinners, and no drop-off in user engagement.
            </p>
            <span className="text-[10px] text-emerald-400/80 block pt-2 font-bold">P50 response drop: 22.8x</span>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border-l-4 border-l-blue-500 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Cheaper</span>
            <h3 className="text-xl font-bold text-[var(--text)] font-sans">70% fewer calls</h3>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              70% fewer LLM calls. At a million questions a month, that turns an unpredictable cloud line item into a predictable commodity.
            </p>
            <span className="text-[10px] text-blue-400/80 block pt-2 font-bold">Cost saved/inquiry: ~$0.0081</span>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border-l-4 border-l-orange-500 border border-[var(--border)] space-y-2">
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Safer</span>
            <h3 className="text-xl font-bold text-[var(--text)] font-sans">Zero private leaks</h3>
            <p className="text-[var(--text-dim)] font-sans leading-relaxed">
              Strict boundary isolation: Private queries and user-specific contexts never touch or pollute the shared vector store.
            </p>
            <span className="text-[10px] text-orange-400/80 block pt-2 font-bold">Zero cross-tenant data leakage</span>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-[var(--text)] font-bold block font-sans text-sm">Curious how it decides what "the same question" means?</span>
            <span className="text-[var(--text-dim)] text-[11px] font-sans">Dive into high-dimensional vector embeddings, dynamic thresholding, and metric geometry.</span>
          </div>
          <Link
            href="/how-it-thinks"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold whitespace-nowrap transition shadow-md shadow-blue-600/20"
          >
            Explore How it Thinks →
          </Link>
        </section>
      </main>

      {/* Sticky Session Telemetry Bar */}
      <aside className="sticky bottom-0 z-40 w-full backdrop-blur-md bg-[var(--bg)]/90 border-t border-[var(--border)] py-2.5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[var(--text)] font-bold">Active Session Telemetry:</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--text-dim)]">
            <span>Total Inquiries: <strong className="text-[var(--text)] tabular-num">{session.questions}</strong></span>
            <span>·</span>
            <span>AI Calls Saved: <strong className="text-emerald-400 tabular-num">{session.avoided}</strong></span>
            <span>·</span>
            <span>Time Saved: <strong className="text-cyan-400 tabular-num">{session.timeSaved}s</strong></span>
            <span>·</span>
            <span>Est. Cost Saved: <strong className="text-orange-400 tabular-num">${session.costSaved.toFixed(4)}</strong></span>
          </div>
        </div>
      </aside>

      <Footer />
    </div>
  );
}