---
description: Generate a dependency-ordered, test-first tasks.md from spec.md and plan.md (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above.** It applies the constitution,
> Development Workflow and Quality Gates (*Flow*, *One artifact per phase*, *Who decides what*)
> and principle VI. Steps above that are not mentioned here still apply.

1. **Gates.** Stop and report, without writing `tasks.md`, when `spec.md` or `plan.md` has an
   open `[NEEDS CLARIFICATION]` marker, or when the Constitution Check of `plan.md` has an item
   without an answer or a FAIL the owner has not accepted.
2. **Inputs are `spec.md` and `plan.md` only.** Ignore every reference above to `data-model.md`,
   `contracts/`, `research.md` and `quickstart.md`. Entities and their constraints come from the
   `## Model` section of `plan.md`; interfaces from `## Contract`; technical decisions from
   `## Decisions`; manual checks from `## Manual validation`.
3. **Verbatim constraints.** The rule in Task Organization, "From Data Model", that quotes each
   field constraint verbatim in the task description, applies to the constraints written in the
   `## Model` section of `plan.md`.
4. **Tests are mandatory** (principle VI). This replaces "Tests are OPTIONAL" and every
   "if tests requested" above. In every user story, test tasks come before implementation
   tasks: each invariant in Model gets a domain unit test; each adapter an integration test
   against the real encrypted database with real migrations; each affected critical journey a
   Maestro E2E test; each new screen a VoiceOver, TalkBack and large-font check. The `bootstrap`
   spec is exempt from RED and its tasks install the runners and suites.
5. **Cite, do not copy.** Tasks cite spec and plan IDs (US1, FR-003, SP-05, D2, MV1). The only
   quoted text is a Model constraint (item 3).
6. **Structure.** Follow the sections of the template. This replaces the parallel execution
   examples and the implementation strategy section of step 4. Keep the `## Analysis`,
   `## Convergence`, `## Review` and `## Decided without asking` sections, with their
   placeholders, at the end of the file.
7. **Decided without asking.** Record each decision this phase takes without the owner in
   `## Decided without asking` of `tasks.md`: `- <decision> — source: <docs/ section | process>
   — reason: <why>`; `- None.` when empty. A new decision of architecture, UX, development
   standard, product rule or clinical matter is not taken here: stop and send it back to
   `/speckit-plan` or `/speckit-clarify`.
