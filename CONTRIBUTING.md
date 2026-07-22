# Contributing to JobNebula

Thanks for helping build a calmer, more transparent way to navigate opportunities.

## Before you start

- Search existing issues and open one for substantial changes.
- For a source adapter, document the official access method, terms, rate limits, provenance fields, and failure behavior.
- Use synthetic data in tests, screenshots, and bug reports.
- Ranking changes must remain explainable and user-overridable.

## Local workflow

```bash
npm ci
npm run dev
npm run check
```

Use a focused branch such as `feat/source-adapter-sdk` or `fix/saved-filter`. Keep pull requests small enough to review and describe any effect on ranking, data retention, or source permissions.

## Definition of done

- Product-contract tests and lint pass.
- Local persistence and the demo workflow still work.
- Documentation and changelog are updated when behavior changes.
- No credentials, personal resume content, or unsupported scraping logic is introduced.
- Accessibility and empty/error states are considered.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
