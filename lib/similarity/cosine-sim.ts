export interface CachedNode {
  id: string;
  prompt: string;
  embedding: number[];
  renderedHtml?: string;
}

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

export function evaluateGatekeeper(similarity: number, threshold: number = 0.90) {
  const isHit = similarity >= threshold;
  return {
    isHit,
    action: isHit ? 'CACHE_HIT' : 'CACHE_BUST',
    latencyMs: isHit ? 140 : 3120,
    costUsd: isHit ? 0.0 : 0.0082,
  };
}
