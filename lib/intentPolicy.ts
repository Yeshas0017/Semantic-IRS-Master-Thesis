export type SharingScope = "public" | "private" | "restricted";

export interface IntentPolicy {
  intent: string;
  confidence: number;
  cacheAllowed: boolean;
  threshold: number;
  maxAgeSeconds: number;
  sharingScope: SharingScope;
  reason: string;
}

export function evaluateIntentPolicy(query: string): IntentPolicy {
  const q = query.toLowerCase().trim();

  // 1. Private User Data (Zero Shared Caching)
  if (
    /(my account|my balance|my profile|billing history|my invoice|my order|password|secret|auth token)/i.test(q)
  ) {
    return {
      intent: "Private User Data",
      confidence: 0.98,
      cacheAllowed: false,
      threshold: 1.0,
      maxAgeSeconds: 0,
      sharingScope: "private",
      reason: "Request contains tenant-specific data; shared semantic cache lookup blocked to prevent cross-user data leakage."
    };
  }

  // 2. Current Pricing or Availability (High Dynamic Volatility)
  if (
    /(price|pricing|cost per|tier cost|rate limit status|availability|current release|today|latest)/i.test(q)
  ) {
    return {
      intent: "Current Pricing or Product Availability",
      confidence: 0.94,
      cacheAllowed: true,
      threshold: 0.96,
      maxAgeSeconds: 300, // 5 minutes
      sharingScope: "restricted",
      reason: "Time-sensitive commercial or status data; strict threshold (0.96) and 5m TTL enforced to prevent stale rates."
    };
  }

  // 3. Version-Specific Configuration (Execution-Sensitive)
  if (
    /(next\.js 15|next\.js 14|next\.js 13|v15|v14|alpine:22|node:20|canary|app router vs pages)/i.test(q)
  ) {
    return {
      intent: "Version-Specific Configuration",
      confidence: 0.92,
      cacheAllowed: true,
      threshold: 0.94,
      maxAgeSeconds: 900, // 15 minutes
      sharingScope: "public",
      reason: "Version-sensitive architectural guidance; elevated similarity threshold (0.94) to prevent version drift."
    };
  }

  // 4. Out-of-Domain Requests
  if (
    /(recipe|cook|weather|nba|football|crypto|song lyrics|movie|movie review|capital of)/i.test(q)
  ) {
    return {
      intent: "Out-of-Domain Requests",
      confidence: 0.99,
      cacheAllowed: false,
      threshold: 1.0,
      maxAgeSeconds: 0,
      sharingScope: "public",
      reason: "Inquiry diverges from technical domain; blocked from shared static manifest."
    };
  }

  // 5. Default: General Technical Documentation
  return {
    intent: "General Technical Documentation",
    confidence: 0.90,
    cacheAllowed: true,
    threshold: 0.90, // Baseline tau
    maxAgeSeconds: 3600, // 60 minutes
    sharingScope: "public",
    reason: "Shared conceptual or architectural documentation; standard 0.90 similarity threshold applied."
  };
}