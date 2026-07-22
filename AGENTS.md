# JobNebula Agent Guide

## Product
- Local-first, explainable career-opportunity workspace.
- Helps users prioritize; it must not automate employment decisions.
- Source provenance and user control are core requirements.

## Run
- Install: `npm ci`
- Develop: `npm run dev`
- Verify: `npm run lint && npm test`

## Architecture
- `app/page.tsx`: opportunity model, filters, actions, local persistence.
- `app/globals.css`: visual system and responsive layout.
- `tests/`: product-contract checks.
- `docs/`: architecture and product decisions.

## Conventions
- Every opportunity keeps its original source and posting context.
- Every score must expose positive signals, gaps, and uncertainty.
- Do not add unsupported scraping or automatic mass-application flows.
- New adapters must document permissions, rate limits, and failure behavior.
- Keep import/export portable and user-owned.

## Current State
- MVP has demo data, search, filters, capture, actions, and local storage.
- Next: onboarding, adapter interface, deduplication, and evaluation data.
