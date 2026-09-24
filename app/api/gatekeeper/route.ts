import { NextRequest, NextResponse } from 'next/server';
import { calculateCosineSimilarity } from '@/lib/similarity/cosine-sim';
import { evaluateIntentPolicy, IntentPolicy } from '@/lib/intentPolicy';

export const runtime = 'nodejs';

interface CachedNode {
  id: string;
  prompt: string;
  embedding: number[];
  renderedContent: string;
  timestamp: number;
  intent: string;
}

// Deterministic unit-normalized 768-dim vector generator
function generateDeterministicEmbedding(text: string): number[] {
  const embedding = new Array(768).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % 768] += charCode * Math.cos(i);
  }
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return norm === 0 ? embedding : embedding.map((val) => val / norm);
}

// 30 Baseline Centroids matching Appendix A.1
const initialCentroids: { id: string; prompt: string; intent: string }[] = [
  { id: "vec_d01", prompt: "How do I optimize Next.js ISR on Cloud Run?", intent: "General Technical Documentation" },
  { id: "vec_d02", prompt: "What is the fastest way to deploy Next.js containers?", intent: "General Technical Documentation" },
  { id: "vec_d03", prompt: "How does stale-while-revalidate work in RFC 5861?", intent: "General Technical Documentation" },
  { id: "vec_d04", prompt: "How to configure Google Cloud Secret Manager?", intent: "General Technical Documentation" },
  { id: "vec_d05", prompt: "How do I reduce Docker container size for Next.js?", intent: "General Technical Documentation" },
  { id: "vec_d06", prompt: "What are React Server Components in Next.js 15?", intent: "General Technical Documentation" },
  { id: "vec_d07", prompt: "How does Cloud Run scale to zero when idle?", intent: "General Technical Documentation" },
  { id: "vec_d08", prompt: "How to set memory limits on Google Cloud Run?", intent: "General Technical Documentation" },
  { id: "vec_d09", prompt: "What is cosine similarity in high-dimensional vector spaces?", intent: "General Technical Documentation" },
  { id: "vec_d10", prompt: "How does L2 normalization simplify dot products?", intent: "General Technical Documentation" },
  { id: "vec_d11", prompt: "How to handle cold starts on serverless containers?", intent: "General Technical Documentation" },
  { id: "vec_d12", prompt: "Explain Time to First Byte in web applications.", intent: "General Technical Documentation" },
  { id: "vec_d13", prompt: "What is the difference between SSG and SSR?", intent: "General Technical Documentation" },
  { id: "vec_d14", prompt: "How to configure multi-stage Docker builds?", intent: "General Technical Documentation" },
  { id: "vec_d15", prompt: "How does Next.js standalone output tracing work?", intent: "General Technical Documentation" },
  { id: "vec_d16", prompt: "What is the dimension of Vertex AI text-embedding-004?", intent: "General Technical Documentation" },
  { id: "vec_d17", prompt: "How does SIMD parallelize matrix multiplications?", intent: "General Technical Documentation" },
  { id: "vec_d18", prompt: "Explain Cache-Control max-age header behavior.", intent: "General Technical Documentation" },
  { id: "vec_d19", prompt: "How to deploy Cloud Run in europe-west3?", intent: "General Technical Documentation" },
  { id: "vec_d20", prompt: "What is the purpose of an Active Neural Gatekeeper?", intent: "General Technical Documentation" },
  { id: "vec_d21", prompt: "How to prevent cross-tenant data leakage in caches?", intent: "General Technical Documentation" },
  { id: "vec_d22", prompt: "What is an acceptance basin on a hypersphere?", intent: "General Technical Documentation" },
  { id: "vec_d23", prompt: "How does Next.js handle client-side route navigation?", intent: "General Technical Documentation" },
  { id: "vec_d24", prompt: "What are the concurrency limits on Cloud Run?", intent: "General Technical Documentation" },
  { id: "vec_d25", prompt: "How to configure Tailwind CSS v4 in Next.js?", intent: "General Technical Documentation" },
  { id: "vec_d26", prompt: "Explain the difference between HNSW and flat vector search.", intent: "General Technical Documentation" },
  { id: "vec_d27", prompt: "How to benchmark Time to First Byte with curl?", intent: "General Technical Documentation" },
  { id: "vec_d28", prompt: "What is the purpose of Float32Array in Node.js?", intent: "General Technical Documentation" },
  { id: "vec_d29", prompt: "How to handle CORS headers in Next.js Route Handlers?", intent: "General Technical Documentation" },
  { id: "vec_d30", prompt: "Explain semantic drift in vector retrieval systems.", intent: "General Technical Documentation" }
];

// Pre-seed the multi-entry in-memory store
const centroidStore: CachedNode[] = initialCentroids.map((c) => ({
  id: c.id,
  prompt: c.prompt,
  embedding: generateDeterministicEmbedding(c.prompt),
  renderedContent: `[Pre-rendered ISR Payload]: Static documentation response for "${c.prompt}".`,
  timestamp: Date.now() - 60000, // Seeded 1 hour ago (well within freshness window)
  intent: c.intent
}));

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/[^\w\s]/gi, '');
}

export async function POST(req: NextRequest) {
  const requestStartTime = performance.now();

  try {
    const body = await req.json();
    const { prompt, threshold: clientThreshold, engine = 'cloud' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    // 1. Fast-Path: In-Memory Exact Lexical Match
    const cleanPrompt = normalizeText(prompt);
    const exactMatch = centroidStore.find((c) => normalizeText(c.prompt) === cleanPrompt);

    if (exactMatch) {
      const durationMs = Math.round(performance.now() - requestStartTime);
      return NextResponse.json({
        success: true,
        action: 'CACHE_HIT',
        decision: {
          isHit: true,
          action: 'CACHE_HIT',
          latencyMs: durationMs,
          costUsd: 0.0,
        },
        policy: {
          intent: exactMatch.intent,
          confidence: 1.0,
          cacheAllowed: true,
          threshold: 1.0,
          maxAgeSeconds: 86400,
          sharingScope: 'public',
          reason: 'Verbatim string match detected; bypassed embedding projection.',
        },
        evalChecks: {
          thresholdMatch: true,
          freshnessMatch: true,
          intentMatch: true,
          cacheAllowed: true,
          reason: 'Exact lexical match bypass.',
        },
        similarity: 1.0,
        effectiveThreshold: 1.0,
        ttfbMs: durationMs,
        cachedNodeId: exactMatch.id,
        cachedPrompt: exactMatch.prompt,
        responseContent: exactMatch.renderedContent,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // 2. Intent-Aware Policy Layer Evaluation
    const policy: IntentPolicy = evaluateIntentPolicy(prompt);
    const effectiveThreshold = clientThreshold !== undefined ? Number(clientThreshold) : policy.threshold;

    // 3. Security Guard: Private Data / Scope Blocking
    if (!policy.cacheAllowed) {
      const durationMs = Math.round(performance.now() - requestStartTime);
      return NextResponse.json({
        success: true,
        action: 'POLICY_BLOCKED',
        decision: {
          isHit: false,
          action: 'POLICY_BLOCKED',
          latencyMs: durationMs,
          costUsd: 0.0,
        },
        policy,
        evalChecks: {
          thresholdMatch: false,
          freshnessMatch: false,
          intentMatch: false,
          cacheAllowed: false,
          reason: policy.reason,
        },
        similarity: 0.0,
        effectiveThreshold,
        ttfbMs: durationMs,
        cachedNodeId: null,
        cachedPrompt: null,
        responseContent: `[Direct Execution Enforced - Shared Cache Bypassed]: ${policy.reason}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // 4. Vector Projection
    const incomingEmbedding = generateDeterministicEmbedding(prompt);

    // 5. In-Memory Exhaustive Sweep across all centroids
    let bestSimilarity = -1;
    let bestCandidate: CachedNode = centroidStore[0];

    for (const node of centroidStore) {
      const sim = calculateCosineSimilarity(incomingEmbedding, node.embedding);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestCandidate = node;
      }
    }

    // 6. Multi-Predicate Composite Decision Rule
    const cachedAgeSeconds = Math.round((Date.now() - bestCandidate.timestamp) / 1000);
    const thresholdMatch = bestSimilarity >= effectiveThreshold;
    const freshnessMatch = cachedAgeSeconds <= policy.maxAgeSeconds;
    const intentMatch = bestCandidate.intent === policy.intent;
    const cacheAllowed = policy.cacheAllowed;

    const isHit = thresholdMatch && freshnessMatch && intentMatch && cacheAllowed;

    let routingReason = '';
    if (isHit) {
      routingReason = `Cache Hit: Query matches [${policy.intent}]. Similarity (${bestSimilarity.toFixed(3)}) >= ${effectiveThreshold} and cache age (${cachedAgeSeconds}s) <= ${policy.maxAgeSeconds}s limit.`;
    } else if (!freshnessMatch) {
      routingReason = `Safe Cache Miss: Freshness limit expired. Cached asset is ${cachedAgeSeconds}s old (ceiling: ${policy.maxAgeSeconds}s). Fresh revalidation scheduled.`;
    } else if (!thresholdMatch) {
      routingReason = `Safe Cache Miss: Cosine similarity (${bestSimilarity.toFixed(3)}) fell below required policy threshold (${effectiveThreshold}). Provisional delivery served while revalidating.`;
    } else if (!intentMatch) {
      routingReason = `Safe Cache Miss: Intent mismatch. Query classified as [${policy.intent}] but cached centroid serves [${bestCandidate.intent}].`;
    }

    let responseText: string;
    if (isHit) {
      responseText = bestCandidate.renderedContent;
    } else {
      responseText = `[Fresh Inference Generated via ${engine.toUpperCase()}]: Cache revalidated for query: "${prompt}".`;
      // Push new entry dynamically into store
      centroidStore.push({
        id: `vector_${Math.random().toString(36).substring(2, 6)}`,
        prompt,
        embedding: incomingEmbedding,
        renderedContent: responseText,
        timestamp: Date.now(),
        intent: policy.intent,
      });
    }

    const durationMs = Math.round(performance.now() - requestStartTime);

    return NextResponse.json({
      success: true,
      action: isHit ? 'CACHE_HIT' : 'SAFE_MISS',
      decision: {
        isHit,
        action: isHit ? 'CACHE_HIT' : 'SAFE_MISS',
        latencyMs: durationMs,
        costUsd: isHit ? 0.0 : 0.0082,
      },
      policy,
      evalChecks: {
        thresholdMatch,
        freshnessMatch,
        intentMatch,
        cacheAllowed,
        reason: routingReason,
      },
      similarity: Number(bestSimilarity.toFixed(3)),
      effectiveThreshold,
      ttfbMs: durationMs,
      cachedNodeId: isHit ? bestCandidate.id : null,
      cachedPrompt: isHit ? bestCandidate.prompt : null,
      responseContent: responseText,
      timestamp: new Date().toLocaleTimeString(),
    });

  } catch (error: unknown) {
    const durationMs = Math.round(performance.now() - requestStartTime);
    const msg = error instanceof Error ? error.message : 'Processing failed';
    return NextResponse.json(
      {
        success: false,
        error: msg,
        ttfbMs: durationMs,
      },
      { status: 500 }
    );
  }
}
