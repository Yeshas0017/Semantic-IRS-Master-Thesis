/**
 * Cosine Similarity & Gatekeeper Logic for Semantic ISR
 * Formula: CosineSim(A, B) = (A . B) / (||A|| * ||B||)
 */

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) {
    return 0;
  }

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

export interface GatekeeperDecision {
  similarity: number;
  threshold: number;
  shouldRevalidate: boolean;
  action: 'CACHE_HIT' | 'CACHE_BUST';
  latencySavedMs: number;
}

/**
 * Gatekeeper Revalidation Trigger: (A · B) / (||A|| ||B||) < tau
 */
export function evaluateGatekeeper(similarity: number, threshold: number): GatekeeperDecision {
  const shouldRevalidate = similarity < threshold;
  return {
    similarity,
    threshold,
    shouldRevalidate,
    action: shouldRevalidate ? 'CACHE_BUST' : 'CACHE_HIT',
    latencySavedMs: shouldRevalidate ? 0 : 3060
  };
}