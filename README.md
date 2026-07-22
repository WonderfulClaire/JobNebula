# JobNebula

![JobNebula social preview](./public/social-card.png)

> Turn scattered opportunities into your career constellation.

JobNebula is an open-source, personal career-intelligence workspace. It collects opportunities from fragmented sources, normalizes them, ranks them against explicit career signals, and explains every match.

## The problem

Job discovery is scattered across company career pages, recruiting platforms, communities, newsletters, and referrals. Generic feeds optimize for volume; candidates need relevance, provenance, and a workflow they can trust.

## Current MVP

- A polished opportunity radar with realistic demo data
- Search and filters for high-fit, remote, and saved roles
- Explainable 0–100 fit scores with positive signals and gaps
- Save, dismiss, and move-to-application actions
- Manual opportunity capture from any source
- Local persistence in the browser
- Responsive interface in Chinese

## Quick start

Requirements: Node.js 22.13+

```bash
npm install
npm run dev
```

## Product principles

1. **Provenance first** — keep the original source and posting time attached.
2. **Explain the score** — show the signals, conflicts, and missing information.
3. **Human decision** — ranking assists the candidate; it never makes an employment decision.
4. **Precision over auto-apply** — help people spend attention on opportunities that deserve it.

## Architecture direction

The demo is local-first and intentionally has no crawler backend. The next stage separates the system into source adapters, a normalized opportunity schema, deduplication, an explainable scoring engine, and user-controlled delivery channels.

Source adapters should use official APIs, feeds, user-provided links, or explicitly permitted public sources. Unsupported scraping is out of scope.

## Roadmap

- [ ] Resume and preference onboarding
- [ ] Extensible source-adapter interface
- [ ] Duplicate detection across sources
- [ ] Embedding-based retrieval plus explainable reranking
- [ ] Daily digest and saved searches
- [ ] Application timeline and reminders
- [ ] Browser extension for user-initiated capture
- [ ] Export/import in a portable open format

## Contributing

Contributions are welcome, especially source adapters with clear terms, ranking evaluation datasets, accessibility improvements, and internationalization.

## License

MIT
