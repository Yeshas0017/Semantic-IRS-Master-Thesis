'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArchitecturePage() {
  const [copied, setCopied] = useState(false);

  const deployCommand = `gcloud run deploy semantic-isr-service \\
  --image gcr.io/gen-lang-client-0811772351/semantic-isr-service:latest \\
  --region europe-west3 \\
  --platform managed \\
  --allow-unauthenticated \\
  --memory 512Mi \\
  --cpu 1 \\
  --min-instances 0 \\
  --max-instances 10 \\
  --concurrency 80 \\
  --timeout 300`;

  function handleCopy() {
    navigator.clipboard.writeText(deployCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080C16] text-[#F2F5FA] latent-grid">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-16 w-full">
        {/* Header & Latency Card */}
        <section className="space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#6C8CFF]/10 text-[#6C8CFF] border border-[#6C8CFF]/20">
            <span>CHAPTER 03 & 04 · SYSTEMS ARCHITECTURE & EMPIRICAL TOPOLOGY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Systems Architecture & Empirical Topology
          </h1>

          <p className="text-sm text-[#98A4BC] max-w-3xl leading-relaxed">
            Micro-second request lifecycle routing deterministic high-dimensional Euclidean vector space math, and operational serverless container infrastructure in GCP europe-west3.
          </p>

          <div className="flex items-center gap-6 text-xs font-mono text-[#5E6B85] pt-1">
            <span>INDEX DIMENSIONALITY: <strong className="text-white">768-D Flat L2</strong></span>
            <span>·</span>
            <span>TOKEN OVERHEAD: <strong className="text-[#00E5A0]">&lt; 14 ms</strong></span>
          </div>
        </section>

        {/* 4.1 Interactive Request Lifecycle Trace */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-[#5E6B85] uppercase tracking-wider block">EXECUTION TRACE</span>
              <h2 className="text-lg font-bold font-mono text-white">Interactive Request Lifecycle Execution Trace</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            {/* Timeline Steps */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[#080C16] border border-[#1E2B48] flex justify-between items-center">
                <span>01. Clean & Normalise Text</span>
                <span className="text-[#00E5A0] font-bold">&lt; 1.0 ms</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080C16] border border-[#1E2B48] flex justify-between items-center">
                <span>02. Exact Match Check (Network)</span>
                <span className="text-[#00E5A0] font-bold">~0.1 ms</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080C16] border border-[#1E2B48] flex justify-between items-center">
                <span>03. Convert Text to Vector Representation</span>
                <span className="text-[#6C8CFF] font-bold">~14.2 ms</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080C16] border border-[#1E2B48] flex justify-between items-center">
                <span>04. Compare Against Cached Vectors</span>
                <span className="text-[#00E5A0] font-bold">&lt; 1.2 ms</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080C16] border border-[#1E2B48] flex justify-between items-center">
                <span>05. Multi-Predicate Decision Rule</span>
                <span className="text-[#00E5A0] font-bold">&lt; 0.2 ms</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-lg bg-[#00E5A0]/10 border border-[#00E5A0]/30 text-[#00E5A0] text-center font-bold">
                  <span>CACHE HIT (Static Edge)</span>
                  <p className="text-base text-white mt-1">~140 ms</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FF5C7A]/10 border border-[#FF5C7A]/30 text-[#FF5C7A] text-center font-bold">
                  <span>CACHE MISS (LLM Gen)</span>
                  <p className="text-base text-white mt-1">~3,120 ms</p>
                </div>
              </div>
            </div>

            {/* Micro-bench specs */}
            <div className="p-5 rounded-xl bg-[#080C16] border border-[#1E2B48] space-y-3">
              <span className="text-[10px] text-[#5E6B85] uppercase tracking-wider block font-bold">
                Stage 4: In-Memory Flat L2 Dot-Product Matrix Sweep
              </span>
              <div className="space-y-1 text-[#98A4BC]">
                <p>Execution Latency: <strong className="text-white">1.18 ms</strong></p>
                <p>Vector Throughput: <strong className="text-[#00E5A0]">2.1 MB/s</strong></p>
                <p>Memory Array: <strong className="text-[#6C8CFF]">Float32Buffer</strong></p>
              </div>
              <p className="text-[11px] text-[#5E6B85] font-sans leading-relaxed pt-2 border-t border-[#1E2B48]">
                Utilizes AVX-512 SIMD vector register instructions. Pre-normalizing vectors upon ingestion reduces cosine similarity to pure multiply-accumulate arithmetic.
              </p>
            </div>
          </div>
        </section>

        {/* 4.2 The Multi-Predicate Decision Rule */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#5E6B85] uppercase tracking-wider block">FORMALIZED GATEKEEPER LOGIC</span>
            <h2 className="text-lg font-bold font-sans text-white">The Multi-Predicate Decision Rule</h2>
            <p className="text-xs text-[#98A4BC] font-sans mt-0.5">
              A formal mathematical formulation defining the exact conditions under which an incoming query qualifies for zero-latency static delivery versus asynchronous background regeneration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080C16] border border-[#6C8CFF]/40 text-[#6C8CFF] space-y-2">
            <span className="text-[10px] text-[#5E6B85] uppercase block">THEORY 3.6 · MULTI-PREDICATE CONJUNCTION RULE</span>
            <div className="p-3 rounded-lg bg-[#0E1424] border border-[#1E2B48] text-white font-bold overflow-x-auto text-sm">
              Serve Cached Page ⟺ ( cos(u, v_j) ≥ τ_i ) ∧ ( T_now - T_c &lt; T_freshness ) ∧ ( Intent(u) = Intent(v_j) ) ∧ ( Scope(u) = PUBLIC )
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E2B48] space-y-1">
              <span className="text-[10px] text-[#5E6B85]">1. L2 Unit Vector Normalization</span>
              <p className="text-white font-bold">u = v / ||v||₂</p>
              <p className="text-[11px] text-[#98A4BC] font-sans">Eliminates square root and division calls during request evaluation.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E2B48] space-y-1">
              <span className="text-[10px] text-[#5E6B85]">2. Nearest Vector Similarity</span>
              <p className="text-white font-bold">s* = max_j ( u · v_j )</p>
              <p className="text-[11px] text-[#98A4BC] font-sans">Hardware-accelerated dot product sweep over indexed centroids.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#080C16] border border-[#1E2B48] space-y-1">
              <span className="text-[10px] text-[#5E6B85]">3. Dynamic Threshold Function</span>
              <p className="text-white font-bold">τ_i = f(Intent, Volatility)</p>
              <p className="text-[11px] text-[#98A4BC] font-sans">Strictness bounds scale from 0.90 to 0.96 depending on entity domain.</p>
            </div>
          </div>
        </section>

        {/* 4.3 Production Technology Stack */}
        <section className="space-y-4 font-mono text-xs">
          <h2 className="text-lg font-bold font-sans text-white">The Production Technology Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0E1424] border border-[#1E2B48]">
              <span className="text-[10px] text-[#5E6B85]">FRAMEWORK</span>
              <p className="font-bold text-white mt-1">Next.js 15</p>
              <span className="text-[10px] text-[#98A4BC]">React Server Components (RSC)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1424] border border-[#1E2B48]">
              <span className="text-[10px] text-[#5E6B85]">RUNTIME</span>
              <p className="font-bold text-white mt-1">Node 20 LTS</p>
              <span className="text-[10px] text-[#98A4BC]">TypeScript strict mode</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1424] border border-[#1E2B48]">
              <span className="text-[10px] text-[#5E6B85]">CLOUD HOSTING</span>
              <p className="font-bold text-white mt-1">Google Cloud Run</p>
              <span className="text-[10px] text-[#98A4BC]">europe-west3 scale-to-zero</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1424] border border-[#1E2B48]">
              <span className="text-[10px] text-[#5E6B85]">EMBEDDINGS</span>
              <p className="font-bold text-white mt-1">Vertex AI</p>
              <span className="text-[10px] text-[#98A4BC]">text-embedding-004</span>
            </div>
          </div>
        </section>

        {/* 4.4 Architectural Trade-Off Analysis */}
        <section className="space-y-4 font-mono text-xs">
          <h2 className="text-lg font-bold font-sans text-white">Architectural Trade-Off Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#0E1424] border border-[#1E2B48] space-y-2">
              <span className="text-[10px] text-[#6C8CFF] font-bold">1. EMBEDDING GENERATION INFRASTRUCTURE</span>
              <p className="text-white font-bold font-sans">Vertex AI Cloud API over Local Ollama</p>
              <p className="text-[#98A4BC] font-sans text-[11px] leading-relaxed">
                Local inference (nomic-embed-text) added 1.2GB to container weight and required 35ms on CPU. Vertex AI in europe-west3 returns in ~14ms and maintains a 307MB container footprint.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1424] border border-[#1E2B48] space-y-2">
              <span className="text-[10px] text-[#6C8CFF] font-bold">2. VECTOR STORAGE & SEARCH INDEX</span>
              <p className="text-white font-bold font-sans">In-Memory Flat Array over Redis / pgvector</p>
              <p className="text-[#98A4BC] font-sans text-[11px] leading-relaxed">
                External database calls incur an 8ms network transit penalty and continuous hosting fees. Scanning 5,000 vectors in local heap executes in &lt;1.2ms at zero standby cost.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1424] border border-[#1E2B48] space-y-2">
              <span className="text-[10px] text-[#6C8CFF] font-bold">3. REQUEST INTERCEPTION LAYER</span>
              <p className="text-white font-bold font-sans">Origin Next.js Runtime over Edge Workers</p>
              <p className="text-[#98A4BC] font-sans text-[11px] leading-relaxed">
                Edge runtimes enforce 50ms compute timeouts. Origin hosting allows direct access to the Next.js internal static page regeneration pipeline.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1424] border border-[#1E2B48] space-y-2">
              <span className="text-[10px] text-[#6C8CFF] font-bold">4. CACHE EVICTION TOPOLOGY</span>
              <p className="text-white font-bold font-sans">Semantic Density Pruning over LRU</p>
              <p className="text-[#98A4BC] font-sans text-[11px] leading-relaxed">
                LRU discards valuable centroids during temporary traffic spikes. Density-based pruning removes clustered redundant centroids (s ≥ 0.98), maximizing vector-space coverage.
              </p>
            </div>
          </div>
        </section>

        {/* 4.5 Containerization & Deploy */}
        <section className="p-7 rounded-2xl bg-[#0E1424] border border-[#1E2B48] space-y-5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#5E6B85] uppercase tracking-wider block">CONTAINERIZATION ARCHITECTURE</span>
              <h2 className="text-lg font-bold font-sans text-white">Multi-Stage Alpine Optimization (1.2GB → 307MB)</h2>
            </div>
            <span className="text-[#00E5A0] font-bold bg-[#00E5A0]/10 px-2.5 py-1 rounded-full border border-[#00E5A0]/30">
              Cold Start &lt; 800ms
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-[#5E6B85]">
              <span>Standard Full-Stack Image: 1,240 MB</span>
              <span className="text-[#00E5A0] font-bold">Optimized Alpine Image: 307 MB (-75%)</span>
            </div>
            <div className="w-full bg-[#080C16] h-3.5 rounded-full overflow-hidden border border-[#1E2B48] flex">
              <div className="bg-[#00E5A0] h-full" style={{ width: '25%' }}></div>
              <div className="bg-[#FF5C7A]/20 h-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] text-[#5E6B85] mb-2">
              <span>Production Deploy Command (semantic-isr-service):</span>
              <button onClick={handleCopy} className="text-[#6C8CFF] hover:underline font-bold">
                {copied ? '✓ Copied' : 'Copy command'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#080C16] border border-[#1E2B48] text-white overflow-x-auto text-[11px]">
              {deployCommand}
            </pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}