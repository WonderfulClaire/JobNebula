# Architecture

JobNebula's MVP is intentionally local-first. The UI owns a normalized opportunity model, explainable ranking fields, workflow status, filters, and browser persistence.

The next backend iteration should keep five separable layers:

1. Permission-aware source adapters.
2. Normalization and provenance.
3. Cross-source deduplication.
4. Retrieval plus explainable reranking.
5. User-controlled delivery and application workflow.

## Non-goals

- Unsupported scraping.
- Opaque candidate scoring.
- Automatic mass application.
- Selling or sharing personal career data.

Each future score should be decomposable into positive signals, conflicts, missing information, and confidence.
