export const RESEARCH_CONFIG = {
    METRICS: {
        BASELINE_TTFB_MS: 3200, // From Cloud Render Lab baseline [cite: 237]
        TARGET_LIGHTHOUSE_SCORE: 95, // Goal from Expected Outcomes [cite: 137]
    },
    EXPERIMENT: {
        // Thresholds defined in your Phase 2 plan [cite: 246]
        THRESHOLDS: [0.80, 0.85, 0.90, 0.95],
        CONTROL_INTERVAL_SEC: 60, // Traditional ISR revalidation [cite: 132]
    },
    GCP: {
        MODEL: "text-embedding-004", // Vertex AI model for Phase 3 [cite: 262]
        REGION: "us-central1"
    }
};