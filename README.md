ISR: Intelligent Revalidation for LLM-Integrated Web Applications
Master Thesis - SRH Hochschule Heidelberg
This repository contains the implementation and experimental data for my Master's Thesis, focused on optimizing AI web performance and reducing operational cloud costs using semantic revalidation .
1. Research Metadata
Thesis Title: ISR: Intelligent Revalidation for LLM-Integrated Web Applications on Google Cloud Run
Student: Yeshas Narasimha Murthy (Matriculation ID: 100002275)
Supervisors: Prof. Dr. Kamellia Reshadi (1st) & Prof. Dr. Paul Tanzer (2nd)
Official Start Date: April 7, 2026
Submission Deadline: September 10, 2026
2. Problem Statement
Current Incremental Static Regeneration (ISR) systems rely on "semantically blind" fixed-time intervals (e.g., 60-second timers). This leads to:
Redundant Inference Tax: Identical queries trigger expensive LLM API calls simply because a timer expired.
Stale-Data Risk: Outdated content is served for new intents because the revalidation window is still active.
3. Proposed Solution: The Semantic Gatekeeper
I am developing a "Semantic Gatekeeper" middleware using GCP Cloud Functions and Vertex AI Embeddings.
Process: Every incoming query is vectorized to calculate the Cosine Similarity between the request and cached content.
Trigger: Cache revalidation is triggered only when a significant shift in user intent is detected, rather than at fixed intervals.
4. Expected Outcomes
Cost Efficiency: Reducing operational costs by 30-40% through eliminated redundant re-renders.
Performance: Maintaining Lighthouse Performance scores >95.
Data Freshness: Triggering immediate cache busts for distinct new user intents.
5. Project Roadmap
Phase 1 (April): Foundation, Literature Review, and Baseline extraction from Cloud Render Lab.
Phase 2 (May): Architecture Design & Threshold Definition ($\tau \in \{0.80, 0.85, 0.90, 0.95\}$).
Phase 3 (June): Full Implementation on Google Cloud Platform.
Phase 4 (July): Experimentation with a 100-prompt benchmark dataset .
Phase 5 (August): Statistical Significance Testing (t-test/Mann-Whitney U) and Writing .
Phase 6 (September): Finalization, Clean GitHub Repo, and Submission.
