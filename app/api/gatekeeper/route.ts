import { NextRequest, NextResponse } from 'next/server';
import { calculateCosineSimilarity, evaluateGatekeeper } from '@/lib/similarity/cosine-sim';
interface CachedNode {
  id: string;
  prompt: string;
  embedding: number[];
  renderedContent: string;
  timestamp: number;
}

let isrNodeCache: CachedNode = {
  id: 'vector_d14c',
  prompt: 'How to optimize Next.js ISR on Google Cloud Run?',
  embedding: Array.from({ length: 768 }, (_, i) => Math.sin(i * 0.1)),
  renderedContent: 'Next.js ISR on Cloud Run leverages serverless revalidation cycles combined with intent caching to reduce cold inference taxes.',
  timestamp: Date.now()
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
    const { prompt, threshold = 0.90, engine = 'cloud' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt string is required' }, { status: 400 });
    }

    const incomingEmbedding = generateDeterministicEmbedding(prompt);
    const similarity = calculateCosineSimilarity(incomingEmbedding, isrNodeCache.embedding);
    const decision = evaluateGatekeeper(similarity, threshold);

    let ttfbMs: number;
    let responseText: string;

    if (decision.action === 'CACHE_HIT') {
      ttfbMs = 140;
      responseText = isrNodeCache.renderedContent;
    } else {
      ttfbMs = engine === 'cloud' ? 3120 : 1850;
      responseText = `[Fresh Inference Generated via ${engine.toUpperCase()}]: Cache revalidated for query: "${prompt}".`;
      
      isrNodeCache = {
        id: `vector_${Math.random().toString(36).substring(2, 6)}`,
        prompt,
        embedding: incomingEmbedding,
        renderedContent: responseText,
        timestamp: Date.now()
      };
    }

    return NextResponse.json({
      success: true,
      decision,
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