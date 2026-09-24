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

  // 1. Private User Data (Zero Shared Caching / Tenant Isolation)
  if (
    /(my account|my balance|my profile|billing history|invoice|credit card|card balance|my order|password|secret|auth token|session token|tokens|credentials|api key|api keys)/i.test(q)
  ) {
    return {
      intent: "Private User Data",
      confidence: 0.98,
      cacheAllowed: false,
      threshold: 1.0,
      maxAgeSeconds: 0,
      sharingScope: "private",
      reason: "Tenant-specific credential or private data request; shared semantic cache lookup blocked to prevent cross-user leakage."
    };
  }

// 2. Out-of-Domain Requests (Strict Rejection from Technical Corpus)
  if (
    /\b(pasta|carbonara|recipe|cook|cooking|dog|dogs|cat|cats|poem|poetry|ocean waves|sunsets|flight distance|capital city|capital of|fifa|world cup|weather|nba|football|crypto|song lyrics|movie)\b/i.test(q)
  ) {
    return {
      intent: "Out-of-Domain Requests",
      confidence: 0.99,
      cacheAllowed: false,
      threshold: 1.0,
      maxAgeSeconds: 0,
      sharingScope: "restricted",
      reason: "Inquiry diverges from Cloud Run and web architecture domain; blocked from shared static manifest."
    };
  }

  // 3. Current Pricing, Spot Rates, or Availability (High Dynamic Volatility)
  if (
    /(price|pricing|spot price|cost per|tier cost|rate limit status|availability|current release|today|latest|live memory quota)/i.test(q)
  ) {
    return {
      intent: "Current Pricing or Product Availability",
      confidence: 0.94,
      cacheAllowed: true,
      threshold: 0.96,
      maxAgeSeconds: 300, // 5 minutes
      sharingScope: "restricted",
      reason: "Time-sensitive commercial or quota data; strict threshold (0.96) and 5m TTL enforced to prevent stale rates."
    };
  }

  // 4. Version-Specific Configuration (Execution-Sensitive - Strict tau = 0.94)
  if (
    /(next\.js 15|next\.js 14|next\.js 13|next 14|next 13|v15|v14|v3|v4|tailwind css v3|tailwind css v4|alpine:22|node:20|canary|app router vs pages)/i.test(q)
  ) {
    return {
      intent: "Version-Specific Configuration",
      confidence: 0.92,
      cacheAllowed: true,
      threshold: 0.94,
      maxAgeSeconds: 900, // 15 minutes
      sharingScope: "public",
      reason: "Version-sensitive architectural guidance; elevated similarity threshold (0.94) enforced to prevent cross-version drift."
    };
  }

  // 5. Default: General Technical Documentation (Baseline tau = 0.90)
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
