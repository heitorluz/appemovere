# Emovere — product documentation

> Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device. It does not diagnose, assess risk, prescribe or monitor anyone.

Emovere is a private, local-first mobile app (pt-BR, Brazil only in Phase 1) that helps adults record how they are, notice patterns in their own records and bring what they learned to the conversation with their professional. The code computes the patterns; AI, if kept in Phase 2, only writes them as text.

This folder is the product specification: **what** the product is. **How** it is built lives in the [constitution draft](constitution-draft.md). When the two disagree, the disagreement is resolved in the same change, in either direction.

## If you are in crisis

Emovere is not an emergency service. In Brazil, call **CVV 188** (24 hours, free) or **SAMU 192**, or go to the nearest UPA or emergency room.

## Current state

- No app code yet. Development starts with spec `001-bootstrap` (see the [Spec plan](roadmap/spec-plan.md)).
- Every clinical item (content, factors, thresholds, help texts) is a draft until the clinical co-author, a licensed psychologist, reviews it.
- No one other than the maintainer uses the app with real data until the evaluation by psychologists and the legal review are done (see [Phases](product/05-phases.md)).
- No license yet: it is chosen in legal review (ADR-029).

## Map

### Product

| # | Document | What it covers |
|---|---|---|
| 01 | [Vision and scope](product/01-vision-and-scope.md) | Vision, problem, goals, non-goals and product principles |
| 02 | [Positioning and language](product/02-language.md) | How the app talks: the controlled-language table (use / avoid) |
| 03 | [Personas and journeys](product/03-personas-and-journeys.md) | Personas and the priority journeys (J1–J4 and J6; J5 belongs to Phase 3) |
| 04 | [Domain model](product/04-domain-model.md) | Modules and main entities, such as `CheckIn`, `FactorLog` and `Pattern` |
| 05 | [Phases](product/05-phases.md) | Phase 0 (stages 0.1 to 0.3), closed beta and Phases 1 to 4 |
| 06 | [Non-functional requirements](product/06-non-functional-requirements.md) | Security, privacy, platform, reliability, performance, accessibility and more |
| 07 | [Clinical safety](product/07-clinical-safety.md) | Psychological safety criteria SP-01 to SP-27 |
| 08 | [Insights and AI](product/08-insights-and-ai.md) | The insight rule, factors and the role of AI |
| 09 | [Architecture](product/09-architecture.md) | The local-first architecture with no own server in Phase 1, and how it may evolve |
| 10 | [Testing strategy](product/10-testing-strategy.md) | Process, test layers and test data |
| 11 | [LLM evals](product/11-llm-evals.md) | How AI output is evaluated (Phase 2) |
| 12 | [Observability](product/12-observability.md) | Metrics and telemetry rules |
| 13 | [Privacy](product/13-privacy.md) | LGPD (Brazil's data protection law), what leaves the phone and the commitments |
| 14 | [UI and UX](product/14-ui-ux.md) | Principles, the visual direction and the Phase 1 screens |
| 15 | [Success criteria](product/15-success-criteria.md) | Prerequisites per stage, launch checklist and learning metrics |
| 16 | [Risks](product/16-risks.md) | Product and project risks with mitigations |
| 17 | [Backlog](product/17-backlog.md) | Work by stage |
| 18 | [Open questions](product/18-open-questions.md) | What is still undecided |
| 19 | [References](product/19-references.md) | Clinical, safety, AI, regulatory and technical sources |
| — | [Sensitive-feature Definition of Done](product/appendix-sensitive-feature-dod.md) | The bar a sensitive feature meets before anyone other than the maintainer uses it |

### Decisions, safety and plan

- [ADRs](decisions/adrs.md) — architecture and product decisions ADR-001 to ADR-032.
- [Hazard log](safety/hazard-log.md) — what can go wrong for the people who use the app, and the protections.
- [Constitution draft](constitution-draft.md) — the development rules for Spec Kit (v0.2.1).
- [Spec plan](roadmap/spec-plan.md) — the order of the specs for the app and the AI lab.
- [Use-case diagrams](diagrams/use-cases.md) — nine diagrams, as PNG and editable Excalidraw files.
- [Domain class diagram](diagrams/class-diagram.md) — the domain model behind spec 002, with modelling decisions and open questions.
- [False-insight simulation](research/false-insight-simulation.py) — the synthetic-data simulation behind the insight rule (ADR-022); requires Python 3 and numpy.

## Conventions

- App text is in Portuguese (pt-BR). In these documents, each app string is followed by an English gloss: "Preciso de ajuda" ("I need help").
- Statements are labeled when it matters: **Fact** (with a source), **Opinion**, **Hypothesis** and **Open question**.
- IDs are stable and cited across documents: SP-xx (safety criteria), ADR-xxx (decisions), H-xx (hazards), J1–J6 (journeys).
- Real data never enters this repository — not in fixtures, tests, screenshots, issues or prompts (ADR-009, ADR-029). Only synthetic personas are used.
