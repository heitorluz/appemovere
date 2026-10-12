# Architecture

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Initial architecture: local-first app, no own server in Phase 1

```text
App repository (TypeScript, public; ADR-029)
apps/
  mobile/     # Expo + React Native + TypeScript (iOS and Android)
  api/        # Phase 2 only, if approved (FastAPI + Python), moved over from the lab

packages/
  domain/     # tracking, insights, care_safety — pure TypeScript, no React (DDD + TDD);
              # includes the false-insight simulation ported as a test (SP-22)
  content/    # help resources and versioned texts, with clinical review

AI lab repository (Python, public; ADR-030)
rag/          # generic RAG library (its own package)
revisor/      # text reviewer: public sources → report for the clinical co-author
evals/        # AI evaluation harness (Phase 2), with synthetic Patterns
simulation/   # original false-insight simulation (generates synthetic Patterns)

Each domain module
  domain/  application/  infrastructure/  tests/
```

- **Data only on the device (ADR-018):** encrypted SQLite (expo-sqlite with SQLCipher), with the key in the Keychain/Keystore (expo-secure-store), bound to this device only and excluded from the system backup (SP-25). There is no server for health data.
- **No own server in Phase 1 (ADR-024):** content is bundled in the app. The only required network read is a static configuration file, published on the project website, that **can only turn features off**. If someone tampers with it, the worst case is a feature turned off. Without internet, the safe configuration bundled in the app applies.
- The domain — `Pattern` calculation, insight rule, validator — is pure TypeScript, tested without the app and without the database.
- Local notifications, scheduled on the device: there is no push server.
- Build and release through EAS; remote updates only when signed (see [Non-functional requirements](06-non-functional-requirements.md)).
- Three builds: the maintainer's personal build (real data), development, and demo (synthetic personas).
- **Public repository from the first commit (ADR-029).** Day-to-day content could only leak through the development routine, so the protections are routine ones:
  - Real data never leaves the phone: not to the development computer, not for debugging, not to AI tools used in development. Tests, examples and demos use only fictional data, generated from the personas (see [Personas and journeys](03-personas-and-journeys.md)).
  - `.gitignore` for databases and exports; a check before each commit and in CI that blocks data files; secret scanning with push protection; commits use GitHub's anonymous no-reply email.
  - No log contains entry content (a rule in the code). In the maintainer's personal build, crash reporting is off.
  - Screenshots and videos come only from the demo build.
  - Issue templates carry the warning "never paste real content" and the crisis resources (or the Issues tab is turned off).
  - README in English, with no clinical promise (see [Language](02-language.md)) and with the notice that the app is not a medical device. Clinical texts are marked as drafts until the clinical co-author reviews them.
  - No license file for now (all rights reserved). The license, separate for code and for content, is decided after legal review.
- **Two repositories (ADR-030):** the app repository, in TypeScript, and the AI lab repository, in Python. Both are public.
  - The app publishes the `Pattern` format and the content texts at a pinned version; the lab reads that version.
  - The app never imports code from the lab: RAG and agents stay out of the app by construction.
  - The lab holds only public documents and fictional data; secret scanning is enough.
  - The RAG library has no clinical content and may get an open license before the app's license is decided.
  - Whatever becomes product (for example, the Phase 2 API) moves to the app repository when that phase is approved.
- Each module exposes explicit internal APIs and does not access another module's tables.
- **Phase 2, if kept:** a minimal API (FastAPI) that receives only the `Pattern`, with a TypeScript client generated from OpenAPI.
- **If there is ever a data server** (e.g., encrypted backup in Phase 3): it stores only end-to-end encrypted blobs. For everything else: PostgreSQL with RLS, and a queue in Postgres itself with an outbox.

## Future evolution, driven by signals

| Observed signal | Possible evolution |
|---|---|
| The Phase 2 AI needs a server for people without on-device AI | Minimal API that receives only the `Pattern`. |
| People ask to switch devices without losing data | End-to-end encrypted backup (Phase 3), outside iCloud. |
| Several countries require different policies | Separate the resource configuration and the safety policy by region. |
| A team needs to deploy a module independently | Evaluate incremental extraction, with an ADR and contract tests. |

Microservices are not a goal. They are one possible consequence of scale, team, reliability or compliance needs.
