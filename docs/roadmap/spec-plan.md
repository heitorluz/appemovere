# Spec plan — app and AI lab

> Part of the Emovere product specification. Status: proposal, under review by the maintainer. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

Related: [Product specification](../README.md) · [Constitution (draft)](../constitution-draft.md) · [Hazard log](../safety/hazard-log.md) · [Use-case diagrams](../diagrams/use-cases.md) · [Domain class diagram](../diagrams/class-diagram.md)

## How to read this plan

- **One spec per journey or screen** (see [Testing strategy](../product/10-testing-strategy.md)). Each spec produces only `spec.md`, `plan.md` and `tasks.md` (constitution, *One artifact per phase*).
- The **SP / ADR** column becomes the spec's acceptance criteria.
- **Clinical** marks content that goes to the maintainer and the clinical co-author (constitution, *Who decides what*). Until the co-author reviews it, it ships as a draft.
- Spec names are in English because the repository is public.
- Specs have no fixed number: Spec Kit numbers each spec when it starts (`/speckit.specify`), in the order the work is done, so reordering never leaves gaps. The order below is the planned one, by milestone.

**Why this order (opinion):**
1. **Safety before real data.** The help screen, the lock and the protected database come before the first real entry (constitution, principle II: database excluded from system backups, SP-25, and a key that does not depend only on biometrics, SP-26).
2. **Start collecting data early.** The first insight can only appear after 8 weeks of entries (journey J3). With check-in and factors in the personal build from the start, data accumulates while the rest is built.
3. **Domain before screens.** Pure rules and the simulation come first, test-first (principles III, V and VI).

## Milestone A — Foundations (no real data)

| Spec | Delivers | SP / ADR | Open |
|---|---|---|---|
| `bootstrap` | pnpm monorepo (`apps/mobile` with Expo and `packages/domain`), strict TypeScript; CI with every gate (typecheck, lint, format, tests, `architecture:check`, `constitution:check`, term linter, secret and data-file scanning); `.gitignore` for databases and exports; issue templates with the warning and crisis resources; README without clinical claims; Spec Kit 1.1.x with a local `emovere` preset (one artifact per phase and who decides what, ADR-032), the `claude` and `codex` integrations, the active feature in `.specify/feature.json`, the `github` extension (the tasks become sub-issues) and the gates also run as agent hooks; `.ia/` with the first agents; `docs/` with the SP criteria, the language table and the ADRs cited by the constitution | SP-04 (linter); ADR-029, ADR-030 | — (exempt from RED, per the constitution) |
| `domain-checkin-and-patterns` | Pure domain, test-first, from the [domain class diagram](../diagrams/class-diagram.md): `CheckIn` (one rule per mode; one answer is enough), `EmotionChoice` (the core feeling only, or the word only), `FactorLog` (one per date; empty = "nada hoje" ("nothing today"); forbidden factors), the `DailyOutcomes` and `DailyFactors` projections (notes, emotions and personal tags stay out of the engine), `TestedPair` (up to 4 pairs), `Pattern` and `PatternEvidence` calculation with the parameterized rule (a day without an evening log is left out; day 1 = first check-in) and `NoInsight` with its reason; false-insight simulation as a test | SP-01, SP-06, SP-07, SP-20, SP-22; ADR-011, ADR-022, ADR-023 | SP-22 limit (proposal: 5%) — **clinical** |
| `encrypted-storage` | Local database with SQLCipher, key in Keychain/Keystore, migrations, database excluded from backups on both systems, biometrics change without data loss, deletion that destroys the key. The plan chooses Drizzle or hand-written SQL after a quick spike | SP-25, SP-26; ADR-012, ADR-028 | The Drizzle + SQLCipher spike |
| `app-shell-and-help` | Base navigation; "Preciso de ajuda" ("I need help") button on every screen; offline help screen with public resources (CVV 188, SAMU 192, UPA) and one-tap calling; first Maestro E2E tests | SP-13, SP-21, SP-23; ADR-027 | Help texts — **clinical** |
| `unlock-and-privacy` | Biometric lock and own PIN; content hidden when switching apps; quick exit | SP-21; ADR-027 | — |
| `builds-and-personas` | The three builds (personal, development and demo); synthetic data generator based on the personas; network canary test; personal build without crash reports | ADR-009, ADR-018, ADR-029 | — |

## Milestone B — First real use (personal build)

| Spec | Delivers | SP / ADR | Open |
|---|---|---|---|
| `check-in` | Check-in by mode (Light, Regular and Detailed); "Agora não" ("Not now") without consequences; only a confirmation after saving; emotion on the feelings wheel (`EmotionChoice`: the core feeling is enough, the word is optional; outside the engine); context and note in every mode (in Regular mode, the emotion alone is not enough to save) | SP-01, SP-02, SP-03, SP-05, SP-13 | Final word list — **clinical** (draft until the co-author reviews it) |
| `evening-factors` | Evening log: one tap per factor from the closed list, or "nada hoje" ("nothing today"); no streak to lose | SP-02, SP-20; ADR-023 | **Factor list for personal use** — **clinical** (the maintainer drafts it; the co-author reviews it later) |

> **Milestone: personal use with real data starts**, only on the maintainer's phone, when the specs from `encrypted-storage` to `evening-factors` are done.

## Milestone C — Journal and thoughts

| Spec | Delivers | SP / ADR | Open |
|---|---|---|---|
| `journal` | Free-form journal, only in the encrypted database; keyboard without suggestions or learning; effective deletion | ADR-009 | — |
| `thought-capture` | Thought capture (situation, thought, emotion on the feelings wheel with `EmotionChoice`, and behaviour), with neutral questions and the "levar para a sessão" ("take to the session") destination; reappraisal off by default | SP-04 | Reappraisal on in the personal build (J2 allows it as the maintainer's own experiment)? |

## Milestone D — Review, session and insights

| Spec | Delivers | SP / ADR | Open |
|---|---|---|---|
| `history-and-review` | History, calendar and review screen, with the same help line for everyone | SP-23 | — |
| `session-agenda` | Session agenda: each item is an entry, a topic, or an entry with a note; the evening log does not go on it; a deleted entry shows as "registro removido" ("entry removed"), since the agenda keeps only a reference; removing an insight from the agenda does not undo "taken to the session" | — | — |
| `session-report` | One-page report in PDF or Markdown: choose the period (by the date of the entries), review, remove items, fixed header, warning before sharing, neutral file name, no metadata, temporary copy deleted | SP-23 | Report template — draft now; final version with the psychologists. Does a removed entry appear in the report or is it left out? |
| `insight-cards` | The engine connected to the screen: `InsightEvaluation` every 28 days; `InsightSelector` (at most 2 per evaluation: a pair not yet shown first, then the largest difference; no repetition for 56 days); the safety net over every free text (journal, thought records and check-in notes), with a `NoInsight` of reason SAFETY_NET offering help; during a pause or with hidden numbers, cards wait for the return; fixed-template cards, "Por que estou vendo isso?" ("Why am I seeing this?") with the days on a calendar, the four actions and the text validator | SP-06 to SP-11, SP-15 | Journal safety net (term list), "relevant change", the SAFETY_NET text and the weekend coincidence — **clinical**. Show insights in the personal build before it exists? |

## Milestone E — Controls and care

| Spec | Delivers | SP / ADR | Open |
|---|---|---|---|
| `tracking-controls` | Switch modes, pause for 7 days and hide numbers, without deleting history and without guilt messages on return; meanwhile the insight evaluation runs and cards only appear on return (with `insight-cards`) | SP-12 | — |
| `support-plan` | Support plan (trusted people, what helps), only after unlock | SP-21 | — |
| `reminders` | Optional local reminders, morning and evening, with generic text, never at night and never triggered by absence | SP-14 | — |
| `export-import-delete` | Export and import as an encrypted file; delete destroys the key and the database | ADR-012 | — |
| `wellbeing-checks` | Rumination check every 4 weeks (`RuminationCheck`; skipping counts as an offer), excessive-use offer computed only on the device (`UsageNudgePolicy`, can be turned off), and unwanted-effect report (`UnwantedEffectReport`) | SP-16, SP-17, SP-18 | Texts, answer options for the check and excessive-use signals — **clinical** |
| `seeking-care-page` | "Como buscar acompanhamento" ("How to find care") page (UBS, CAPS, university clinics, CVV) and the optional question "você faz acompanhamento?" ("are you in professional care?"), kept only on the device to adapt the texts | — | Content — **clinical** |

## After personal use (evaluation by psychologists, legal and compliance review, closed beta)

No fixed order, because these depend on the clinical co-author's decisions and on the legal review (see [Backlog](../product/17-backlog.md)):

- `onboarding-and-consents`: age verification through the stores (ADR-025), consents and preferences, with the help line (SP-23).
- `remote-config-brake`: the remote configuration that can only switch features off (SP-24, ADR-024). Depends on where the project site lives (`NEEDS CLARIFICATION` in the constitution).
- `help-counter`: aggregated, anonymous counter of help-screen visits, only with consent.
- `lab-contract`: publish the `Pattern` schema (without the days used, which stay on the device) and the content texts at a fixed version, with a contract test, for the AI lab to read (ADR-030).
- `store-readiness`: store listings following the [language table](../product/02-language.md), privacy labels, Google health-app declaration and distribution in Brazil only.

## AI lab (Python repository, in parallel)

Same Spec Kit format (ADR-031 and ADR-032). The lab only uses public documents and synthetic data.

1. `bootstrap`: public repository, secret scanning from the first commit and an English README.
2. `insight-simulation`: the original false-insight simulation ([research script](../research/false-insight-simulation.py)) as a tested package.
3. `rag-library`: a generic RAG library (ingestion, chunking, embeddings, Postgres + pgvector, hybrid search, FastAPI).
4. `text-reviewer`: the text reviewer for the clinical co-author, using public documents only.
5. `eval-harness`: evals with synthetic `Pattern`s, preparing Phase 2. Depends on the app's `lab-contract`.
6. `observability`: per-request tracing, tokens, cost, latency and the eval score attached to each trace (OpenTelemetry or Langfuse; decided in the spec's plan).
7. `reviewer-agent`: the reviewer as a LangGraph agent (retrieve → check → assemble the report), with a stop for the co-author's approval (human in the loop).
8. `mcp-server`: the reviewer exposed as an MCP server, so that the app's `language-reviewer` SDD agent can consult public sources when reviewing screen texts. It connects both repositories without real data.
9. `deploy`: the reviewer API on **AWS**, with Docker, infrastructure as code (Terraform) and deployment from CI. Services (e.g., Lambda or ECS; Postgres with pgvector) and cost control are decided in the spec's plan.

Out of scope for now, by decision: fine-tuning, multimodal features and Kubernetes — there is no real use for them in this project yet.

## Open questions for the maintainer

These go to the maintainer under the *Who decides what* rule:

1. **Clinical:** the factor list for personal use (`evening-factors`). Proposal: the maintainer drafts it from [Insights and AI](../product/08-insights-and-ai.md), and the co-author reviews it later.
2. **Clinical:** in the personal build, show insights (`insight-cards`) before the journal safety net, written by the co-author, exists?
3. **Clinical:** is thought reappraisal on in the personal build (`thought-capture`)?
4. **Clinical:** the SP-22 limit (`domain-checkin-and-patterns`). The proposal is 5% of people over 24 weeks, with 4 pairs.
5. **Architecture:** does `remote-config-brake` wait until before the closed beta rather than personal use? Recommendation: yes, because it only matters once someone else uses the app.

## Decided without asking

| Decision | Source | Reason |
|---|---|---|
| Granularity: one spec per journey or screen | [Testing strategy](../product/10-testing-strategy.md) | Already decided |
| Help and protections before the first real data | Constitution, principles I and II | Already decided |
| Check-in and factors before the journal | Journey J3 (8 weeks until the first insight) | Process order: data accumulates while the rest is built |
| Spec names in English | Constitution (public repository) | Process |
| The question "você faz acompanhamento?" goes into spec `seeking-care-page` | Journey J6 (the question exists from Phase 1) | Same journey; it adapts the find-care texts |
| After personal use, no fixed order | [Backlog](../product/17-backlog.md) (depends on the co-author and the legal review) | Process |
