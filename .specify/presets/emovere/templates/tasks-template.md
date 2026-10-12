---

description: "Task list template for feature implementation (Emovere preset)"
---

# Tasks: [FEATURE NAME]

**Input**: `specs/[###-feature-name]/spec.md` and `specs/[###-feature-name]/plan.md`

<!--
  Emovere preset (constitution, One artifact per phase; principle VI).
  - Tasks cite spec and plan IDs (US1, FR-003, SP-05, D2, MV1) instead of copying their text.
    The only quoted text is a constraint from the Model section of plan.md, quoted verbatim.
  - In every user story, test tasks come before implementation tasks, and the tests are
    proven RED before the implementation starts.
  - This file also holds the records of the checking phases: Analysis, Convergence and Review.
  - Replace the sample tasks below; do not keep them.
-->

## Format: `- [ ] T### [P] [US#] Description in path — refs`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[US#]**: the user story the task belongs to (story phases only)
- **refs**: the spec and plan IDs the task implements (FR-003, SP-05, D2, MV1)

## Phase 1: Setup

- [ ] T001 [Setup task with exact path] — [refs]

## Phase 2: Foundational

**Blocks every user story.**

- [ ] T002 [Foundational task with exact path] — [refs]

## Phase 3: User Story 1 — [Title] (P1)

**Goal**: US1. **Independent test**: [how this story is verified on its own]

### Tests (write first, prove RED)

- [ ] T003 [P] [US1] Domain unit test for [invariant] in packages/domain/[path] — [FR-001, SP-05]
- [ ] T004 [P] [US1] Integration test for [adapter] against the encrypted database in apps/mobile/[path] — [D1]

### Implementation

- [ ] T005 [US1] [Implementation task] in [path] — [FR-001; Model: "<constraint quoted verbatim>"]

**Checkpoint**: US1 passes its tests on its own.

[Add one phase per user story, in priority order, with the same structure.]

## Phase N: Polish and Cross-Cutting

- [ ] TXXX Update docs/ as the feature requires (VIII) — [docs/ section]
- [ ] TXXX Run the manual validation MV1–MVn from plan.md

## Dependencies and Execution Order

- Setup → Foundational → user stories in priority order → Polish.
- [Story dependencies, if any, citing the task IDs.]

## Analysis

<!--
  Written by /speckit-analyze: one "### Run YYYY-MM-DD" per run, with the findings table,
  the coverage summary, the metrics and the fixes applied (finding ID → file and section
  fixed at its source).
-->

## Convergence

<!--
  Written by /speckit-converge: one "### Round N — YYYY-MM-DD" per round with the tasks it adds.
  Nothing is written when the code already converges.
-->

## Review

<!--
  Manual review by the owner (constitution, Definition of Done per story).
-->

**Result**: [approved | changes requested]

**Decided without asking — verdict**: [the owner's verdict on the lines of spec.md, plan.md and this file]

## Decided without asking

<!--
  Constitution, Who decides what. One line per decision taken without the owner during Tasks,
  Analyze, Implement, Converge and Review:
  "- <decision> — source: <docs/ section | process> — reason: <why>".
  Keep this the last section of the file. Write "- None." when empty.
-->

- None.
