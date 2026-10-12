# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link to spec.md]

**Input**: Feature specification from `specs/[###-feature-name]/spec.md`

<!--
  Emovere preset (constitution, One artifact per phase). plan.md is the only artifact of the
  Plan phase: research.md, data-model.md, contracts/ and quickstart.md are not created; their
  content lives in the sections below. Cite spec IDs (US1, FR-003, SP-05), ADRs and docs/
  sections instead of copying their text. The stack is in the constitution (Technical
  Constraints and Stack); record here only what this feature chooses.
-->

## Summary

[Two to four sentences: what changes technically and which spec IDs it serves.]

## Decisions

<!--
  Every technical decision of this feature. A new decision of architecture, UX or development
  standard goes to the owner (constitution, Who decides what) and enters here with the answer.
  A decision applied from docs/ cites the section it comes from.
-->

| ID | Decision | Chosen | Discarded | Reason |
|----|----------|--------|-----------|--------|
| D1 | [what had to be decided] | [option chosen] | [options discarded] | [why; cite the ADR or docs/ section, or "owner, YYYY-MM-DD"] |

## Model

<!--
  Only what this feature changes: entities, projections, fields, invariants, state transitions,
  migrations. Reference docs/product/04-domain-model.md and docs/diagrams/class-diagram.md
  instead of copying them. Write each constraint precisely (required or optional, ranges,
  enum values, validation rules): /speckit-tasks quotes these constraints verbatim into the
  tasks. Each invariant becomes a domain unit test (VI). Write "No model change." when empty.
-->

### [Entity or projection]

- **Change**: [new | changed | removed]
- **Fields and constraints**: [field — type — constraint]
- **Invariants**: [rule that must always hold]

## Contract

<!--
  What this feature exposes or consumes across a boundary: domain ports and their adapters,
  module internal APIs, navigation and screen contracts, the remote configuration schema, the
  contract published for the AI lab (ADR-030). Name the Zod schemas; do not paste them.
  Write "No contract change." when empty.
-->

## Manual validation

<!--
  Only what unit, integration and Maestro E2E tests do not cover, such as VoiceOver, TalkBack
  and large fonts on new screens (VI) or checks that need a real device.
  Write "None." when empty.
-->

- [ ] **MV1** [what to check] — [how] — [expected result]

## Constitution Check

<!--
  GATE: answer every item before /speckit-tasks and again after the plan is complete,
  PASS or FAIL, with the evidence (a section or ID of this plan or of spec.md).
  A FAIL blocks /speckit-tasks unless the owner accepts it; record the acceptance as a Decision.
  These items mirror the principles of .specify/memory/constitution.md; an amendment that
  changes a principle updates its item here in the same PR.
-->

| # | Principle | Item | Result | Evidence |
|---|-----------|------|--------|----------|
| I | Psychological Safety Before Engagement | spec.md lists every SP criterion the feature affects as acceptance criteria. Nothing adds streaks, points, achievements or signals of a skipped check-in; nothing shows an insight right after a check-in; nothing infers, predicts, ranks or scores the person; no open chat. The help entry point stays visible and working on every screen, offline and before unlock. | [PASS/FAIL] | [ref] |
| II | Real Data Never Leaves the Phone | User data stays only in the encrypted on-device database. Tests, fixtures, examples and screenshots use synthetic persona data only. No record content in logs. No network destination outside the allow-list; no analytics or advertising SDK. | [PASS/FAIL] | [ref] |
| III | The Code Calculates, AI Only Writes | Every pattern or number shown comes from deterministic domain code with the parameterized rule and `NO_INSIGHT`. The pair, insight and 56-day limits hold; forbidden factors and personal tags stay out of the engine. No AI in Phase 1. | [PASS/FAIL] | [ref] |
| IV | Language That Complements, Never Treats | User-facing text follows the language table in docs/: no diagnosis, judgement, obligation or AI in the first person. Clinical content stays marked as draft until the clinical co-author approves it. | [PASS/FAIL] | [ref] |
| V | Dependency Rule Points Inward | `packages/domain` stays pure TypeScript. Storage, key, biometrics, notifications and AI sit behind ports declared in the domain, with adapters in the app and one composition root. No module reads another module's tables; nothing imports from the AI lab. | [PASS/FAIL] | [ref] |
| VI | Test-First, Red-Green-Refactor | Each story's test tasks precede its implementation tasks. Every invariant in Model has a domain unit test; every adapter has an integration test against the real encrypted database; affected critical journeys have Maestro E2E; new screens are checked with VoiceOver, TalkBack and large fonts. (`bootstrap` is exempt from RED and leaves the runners and suites installed.) | [PASS/FAIL] | [ref] |
| VII | Minimal Effective Interaction, Local-First | Nothing is designed to maximize sessions, notifications or minutes of use. No own server. Every new dependency, layer or abstraction answers a need stated in spec.md. | [PASS/FAIL] | [ref] |
| VIII | Documentation and Code in Agreement | spec.md and plan.md cite SP and ADR IDs. The docs/ changes this feature requires are listed and land in the same PR. A sensitive feature meets the sensitive-feature Definition of Done before anyone other than the maintainer uses it. | [PASS/FAIL] | [ref] |

## Decided without asking

<!--
  Constitution, Who decides what. One line per decision taken without the owner during Plan:
  "- <decision> — source: <docs/ section | process> — reason: <why>".
  Keep this the last section of the file. Write "- None." when empty.
-->

- None.
