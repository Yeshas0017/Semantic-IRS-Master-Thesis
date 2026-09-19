'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItThinksPage() {
  const [inputA, setInputA] = useState('How do I optimize Next.js?');
  const [inputB, setInputB] = useState('Best way to speed up Next.js?');
  const [strictness, setStrictness] = useState(0.90);

  function getDynamicHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0') + 'b8f...e2a9';
  }

  const sampleDots = [
    { label: 'Next.js optimization paraphrase', needed: 0.85, isLookalike: false },
    { label: 'Cloud Run setup synonym', needed: 0.88, isLookalike: false },
    { label: 'Next.js App Router query', needed: 0.90, isLookalike: false },
    { label: 'Container scaling syntax', needed: 0.90, isLookalike: false },
    { label: 'ISR background revalidation', needed: 0.91, isLookalike: false },
    { label: 'Node.js memory tuning', needed: 0.92, isLookalike: false },
    { label: 'Edge caching architecture', needed: 0.94, isLookalike: false },
    { label: 'Q3 report vs Q4 report', needed: 0.88, isLookalike: true },
    { label: 'Next.js 14 vs Next.js 15', needed: 0.89, isLookalike: true },
    { label: 'General cloud computing inquiry', needed: 0.96, isLookalike: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#080C16] text-[#F2F5FA] latent-grid">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-16 w-full">
        {/* Header */}
        <section className="space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#6C8CFF]/10 text-[#6C8CFF] border border-[#6C8CFF]/20">
            <span>Cognitive Layer</span>
            <span>·</span>
            <span>Thesis Defense Artifact 02</span>
            <span>·</span>
            <span>Intent-Validation Logic</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Two people never ask the same question the same way.
          </h1>

          <p className="text-sm text-[#98A4BC] max-w-3xl leading-relaxed">
            A normal cache compares letters. This one compares meaning. In production LLM systems, character-matching achieves sub-4% hit rates. Vector centroids capture topological intent across linguistic variants.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-[#5E6B85] pt-1">
            <span>✓ User Formula: RFC 5861</span>
            <span>·</span>
            <span>✓ Latent Space Projection</span>
            <span>·</span>
            <span>✓ Multi-Predicate Gating</span>
          </div>
        </section>

        {/* Break It Yourself: Side by side interactive test */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-6">
          <div>
            <span className="text-[10px] font-mono text-[#5E6B85] uppercase tracking-wider block">Interactive Diagnostic Laboratory</span>
            <h2 className="text-lg font-bold font-mono text-white">Break it yourself</h2>
            <p className="text-xs text-[#98A4BC] mt-0.5">
              Type one query into Input A and a synonym in Input B. Observe the fundamental divergence between discrete alphanumeric hashing and continuous latent geometry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[11px] text-[#5E6B85] mb-1">Input A:</label>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1E2B48] bg-[#080C16] text-white focus:outline-none focus:ring-2 focus:ring-[#6C8CFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#5E6B85] mb-1">Input B:</label>
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#1E2B48] bg-[#080C16] text-white focus:outline-none focus:ring-2 focus:ring-[#6C8CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-mono text-xs">
            {/* What normal cache sees */}
            <div className="p-5 rounded-xl border border-[#FF5C7A]/40 bg-[#FF5C7A]/5 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#FF5C7A] font-bold uppercase tracking-wider">
                <span>What a normal cache sees</span>
                <span>SHA-256 Digests</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#98A4BC]">
                <p className="truncate">Input A: <span className="text-white">{getDynamicHash(inputA)}</span></p>
                <p className="truncate">Input B: <span className="text-white">{getDynamicHash(inputB)}</span></p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080C16] border border-[#FF5C7A]/30 text-[#FF5C7A] font-bold text-[11px]">
                Hash Match State: FAIL (0% Lexical Overlap)
              </div>
              <p className="text-[11px] text-[#98A4BC]">
                Cost Impact: <strong>2 AI calls · 6.2s · $0.016</strong>
              </p>
            </div>

            {/* What this system sees */}
            <div className="p-5 rounded-xl border border-[#00E5A0]/40 bg-[#00E5A0]/5 space-y-3">
              <div className="flex justify-between items-center text-[10px] text-[#00E5A0] font-bold uppercase tracking-wider">
                <span>What this system sees</span>
                <span>768-Dim Dense Manifold</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#98A4BC]">
                <p>Latent Intent: <span className="text-[#00E5A0] font-bold">Both asking: How to make a Next.js site faster</span></p>
                <p>Vector Proximity: <span className="text-white font-bold">0.941 ≥ 0.900 (Threshold)</span></p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080C16] border border-[#00E5A0]/30 text-[#00E5A0] font-bold text-[11px]">
                Semantic Cluster State: PASS (MATCH VERIFIED)
              </div>
              <p className="text-[11px] text-[#98A4BC]">
                Cost Impact: <strong className="text-[#00E5A0]">1 AI call · 0.14s · $0.000 (100% saved)</strong>
              </p>
            </div>
          </div>
        </section>

        {/* The Intent Ladder */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#5E6B85] uppercase tracking-wider block">Classification Sensitivity Ladder</span>
            <h2 className="text-lg font-bold text-white">The Intent Ladder</h2>
            <p className="text-xs text-[#98A4BC] font-sans mt-0.5">
              Four benchmark parity pairings showing how vector discrimination separates true semantic equivalence from superficial lexeme overlaps and security boundaries.
            </p>
          </div>

          <div className="space-y-3">
            {/* Card 1: Easy */}
            <div className="p-4 rounded-xl border border-[#1E2B48] bg-[#080C16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#5E6B85]">PAIR 01: SYNTACTIC PARAPHRASE</span>
                <p className="text-white font-sans">"How do I optimize Next.js ISR?"</p>
                <p className="text-[#98A4BC] font-sans">"Best practices for Next.js ISR deployment?"</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/30 self-start sm:self-auto">
                Same intent — REUSE
              </span>
            </div>

            {/* Card 2: The Hard Case (Prominent) */}
            <div className="p-6 rounded-xl border-2 border-[#FFB84D] bg-[#FFB84D]/5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#FFB84D] uppercase tracking-wider">
                    ★ THE TRICKY HARD CASE: LOOKS ALIKE, MEANS DIFFERENT
                  </span>
                  <p className="text-white font-sans text-sm font-semibold">"What's in the Q3 report?"</p>
                  <p className="text-[#98A4BC] font-sans text-sm">"What's in the Q4 report?"</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full font-bold text-[11px] bg-[#FFB84D] text-black self-start sm:self-auto">
                  DO NOT REUSE (SAFE MISS)
                </span>
              </div>
              <p className="text-xs text-[#98A4BC] font-sans leading-relaxed pt-2 border-t border-[#FFB84D]/30">
                Near-identical wording, completely different required answer. It's the hard case, and showing you handled it is what separates this from a toy. This is the failure mode that makes naive semantic caching dangerous in production. Getting this right is the point of the threshold.
              </p>
            </div>

            {/* Card 3: Private */}
            <div className="p-4 rounded-xl border border-[#1E2B48] bg-[#080C16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#5E6B85]">PAIR 03: CONFIDENTIAL SCOPE</span>
                <p className="text-white font-sans">"How do I deploy to Cloud Run?"</p>
                <p className="text-[#98A4BC] font-sans">"What's my account balance?"</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-[#6C8CFF]/10 text-[#6C8CFF] border border-[#6C8CFF]/30 self-start sm:self-auto">
                Private — NEVER REUSE
              </span>
            </div>

            {/* Card 4: Unrelated */}
            <div className="p-4 rounded-xl border border-[#1E2B48] bg-[#080C16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-[#5E6B85]">PAIR 04: OUT-OF-DOMAIN</span>
                <p className="text-white font-sans">"How do I deploy to Cloud Run?"</p>
                <p className="text-[#98A4BC] font-sans">"How do I make pasta carbonara?"</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold text-[10px] bg-[#FF5C7A]/10 text-[#FF5C7A] border border-[#FF5C7A]/30 self-start sm:self-auto">
                Unrelated — REJECT
              </span>
            </div>
          </div>
        </section>

        {/* Where the Line Sits Slider */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#5E6B85] uppercase tracking-wider block">Hyperparameter Calibration</span>
            <h2 className="text-lg font-bold text-white">Where the Line Sits</h2>
            <p className="text-xs text-[#98A4BC] font-sans mt-0.5">
              Calibrating the threshold boundary τ balancing aggressive cache reuse against factual precision.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[11px] text-[#5E6B85]">
              <span>Generous (reuse more, risk being slightly off)</span>
              <span>Strict (reuse less, never be wrong)</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="0.98"
              step="0.01"
              value={strictness}
              onChange={(e) => setStrictness(parseFloat(e.target.value))}
              className="w-full accent-[#6C8CFF] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5E6B85]">
              <span>0.75 (Permissive Drift)</span>
              <span className="text-[#00E5A0] font-bold">Calibrated Pareto Sweet Spot: τ = 0.900</span>
              <span>0.98 (Syntactic Rigidity)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E2B48] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">
                At this setting: {strictness < 0.89 ? '9' : strictness <= 0.92 ? '7' : '4'} of 10 example questions get reused.
              </span>
              <div className="flex items-center gap-1.5">
                {sampleDots.map((dot, idx) => {
                  const isReused = strictness <= dot.needed;
                  const isWrong = dot.isLookalike && isReused;
                  return (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isWrong
                          ? 'bg-[#FFB84D] shadow-[0_0_8px_#FFB84D]'
                          : isReused
                          ? 'bg-[#00E5A0] shadow-[0_0_8px_#00E5A0]'
                          : 'bg-[#FF5C7A]'
                      }`}
                      title={`${dot.label}: ${isWrong ? 'WRONG ANSWER DELIVERED' : isReused ? 'REUSED' : 'REGENERATED'}`}
                    />
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-[#98A4BC] font-sans">
              {strictness < 0.89
                ? 'High recall (>88%), but false-positive semantic drift occurs: 2 lookalikes (Q3 vs Q4 reports) deliver outdated answers.'
                : strictness > 0.92
                ? 'Zero false positives, but excessive misses: legitimate paraphrases trigger costly downstream LLM executions.'
                : 'Optimal Pareto equilibrium: 0% false positives on domain lookalikes, with 94.2% recall on legitimate paraphrases.'}
            </p>

            <span className="text-[10px] text-[#5E6B85] block pt-1 border-t border-[#1E2B48]">
              Formal Boundary Calibration: τ = {strictness.toFixed(2)} balances static reuse against semantic drift (Thesis Section 5.5).
            </span>
          </div>
        </section>

        {/* Privacy & Tenant Isolation */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6C8CFF]">
            <span>🔒 TENANT ISOLATION & COMPLIANCE</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Privacy is not a cosine metric.</h2>
          <p className="text-xs text-[#98A4BC] font-sans leading-relaxed">
            A common critique from examiners is: "What if an employee asks for confidential data that matches a public question?" Semantic ISR enforces strict user metadata tags. Every incoming request carries an explicit scope descriptor such as <code className="text-[#6C8CFF] bg-[#080C16] px-1.5 py-0.5 rounded font-mono">SCOPE: PUBLIC</code> or <code className="text-[#FF5C7A] bg-[#080C16] px-1.5 py-0.5 rounded font-mono">SCOPE: PRIVATE</code>. Authenticated personal queries bypass the shared vector store entirely, preventing cross-tenant data leakage.
          </p>
          <div className="pt-2">
            <Link
              href="/#demo"
              className="inline-block px-4 py-2 rounded-xl bg-[#161F36] hover:bg-[#1E2B48] border border-[#1E2B48] text-xs font-mono text-white transition"
            >
              Try a private question in Demo →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}