import { NextRequest, NextResponse } from 'next/server';
import { calculateCosineSimilarity } from '@/lib/similarity/cosine-sim';
import { evaluateIntentPolicy, IntentPolicy } from '@/lib/intentPolicy';

interface CachedNode {
  id: string;
  prompt: string;
  embedding: number[];
  renderedContent: string;
  timestamp: number;
  intent: string;
}

let isrNodeCache: CachedNode = {
  id: 'vector_d14c',
  prompt: 'How to optimize Next.js ISR on Google Cloud Run?',
  embedding: Array.from({ length: 768 }, (_, i) => Math.sin(i * 0.1)),
  renderedContent: 'Next.js ISR on Cloud Run leverages serverless revalidation cycles combined with intent caching to reduce cold inference taxes.',
  timestamp: Date.now() - 120000, // Pre-seeded 2 minutes ago
  intent: 'General Technical Documentation'
};

function generateDeterministicEmbedding(text: string): number[] {
  const embedding = new Array(768).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % 768] += charCode * Math.cos(i);
  }
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return norm === 0 ? embedding : embedding.map(val => val / norm);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, threshold: clientThreshold, engine = 'cloud' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    // 1. Evaluate Intent-Aware Policy Layer (sub-millisecond)
    const policy: IntentPolicy = evaluateIntentPolicy(prompt);

    // Dynamic threshold: use policy-prescribed threshold unless manually overridden
    const effectiveThreshold = clientThreshold !== undefined ? Number(clientThreshold) : policy.threshold;

    // 2. Early Guard: Private User Data or Out-of-Domain Blocked Requests
    if (!policy.cacheAllowed) {
      return NextResponse.json({
        success: true,
        action: 'POLICY_BLOCKED',
        decision: {
          isHit: false,
          action: 'POLICY_BLOCKED',
          latencyMs: engine === 'cloud' ? 3120 : 1850,
          costUsd: 0.0082,
        },
        policy,
        evalChecks: {
          thresholdMatch: false,
          freshnessMatch: false,
          intentMatch: false,
          cacheAllowed: false,
          reason: policy.reason,
        },
        similarity: 0,
        effectiveThreshold,
        ttfbMs: 148,
        cachedNodeId: null,
        cachedPrompt: null,
        responseContent: `[Direct Execution Enforced - Shared Cache Bypassed]: ${policy.reason}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    // 3. Vectorization and Proximity Scanning
    const incomingEmbedding = generateDeterministicEmbedding(prompt);
    const similarity = calculateCosineSimilarity(incomingEmbedding, isrNodeCache.embedding);

    // 4. Multi-Predicate Composite Decision Rule
    // CacheHit = (s* >= tau_i) AND (age <= T_i) AND (intentMatch = true) AND (cacheAllowed = true)
    const cachedAgeSeconds = Math.round((Date.now() - isrNodeCache.timestamp) / 1000);
    const thresholdMatch = similarity >= effectiveThreshold;
    const freshnessMatch = cachedAgeSeconds <= policy.maxAgeSeconds;
    const intentMatch = isrNodeCache.intent === policy.intent;
    const cacheAllowed = policy.cacheAllowed;

    const isHit = thresholdMatch && freshnessMatch && intentMatch && cacheAllowed;

    let routingReason = '';
    if (isHit) {
      routingReason = `Cache Hit: Query matches [${policy.intent}]. Similarity (${similarity.toFixed(3)}) >= ${effectiveThreshold} and cache age (${cachedAgeSeconds}s) <= ${policy.maxAgeSeconds}s limit.`;
    } else if (!freshnessMatch) {
      routingReason = `Safe Cache Miss: Freshness limit expired. Cached asset is ${cachedAgeSeconds}s old (ceiling: ${policy.maxAgeSeconds}s). Fresh revalidation scheduled.`;
    } else if (!thresholdMatch) {
      routingReason = `Safe Cache Miss: Cosine similarity (${similarity.toFixed(3)}) fell below required policy threshold (${effectiveThreshold}). Provisional delivery served while revalidating.`;
    } else if (!intentMatch) {
      routingReason = `Safe Cache Miss: Intent mismatch. Query classified as [${policy.intent}] but cached centroid serves [${isrNodeCache.intent}].`;
    }

    let ttfbMs: number;
    let responseText: string;

    if (isHit) {
      ttfbMs = 140;
      responseText = isrNodeCache.renderedContent;
    } else {
      ttfbMs = engine === 'cloud' ? 3120 : 1850;
      responseText = `[Fresh Inference Generated via ${engine.toUpperCase()}]: Cache revalidated for query: "${prompt}".`;

      // Atomically overwrite centroid with fresh intent and timestamp
      isrNodeCache = {
        id: `vector_${Math.random().toString(36).substring(2, 6)}`,
        prompt,
        embedding: incomingEmbedding,
        renderedContent: responseText,
        timestamp: Date.now(),
        intent: policy.intent
      };
    }

    return NextResponse.json({
      success: true,
      action: isHit ? 'CACHE_HIT' : 'SAFE_CACHE_MISS',
      decision: {
        isHit,
        action: isHit ? 'CACHE_HIT' : 'SAFE_CACHE_MISS',
        latencyMs: isHit ? 140 : 3120,
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
      similarity: Number(similarity.toFixed(3)),
      effectiveThreshold,
      cachedAgeSeconds,
      ttfbMs,
      cachedNodeId: isrNodeCache.id,
      cachedPrompt: isrNodeCache.prompt,
      responseContent: responseText,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gatekeeper execution failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}