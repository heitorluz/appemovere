---
description: Cross-artifact consistency and quality analysis of spec.md, plan.md and tasks.md, recorded in the Analysis section of tasks.md (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above**, including "STRICTLY READ-ONLY" and
> "no file writes". It applies the constitution, Development Workflow and Quality Gates:
> *One artifact per phase* and *Who decides what*. Steps above that are not mentioned here
> still apply.

1. **Record in `tasks.md`.** Write the report of step 6 under `## Analysis` in `tasks.md`, as
   `### Run YYYY-MM-DD` (findings table, coverage summary, constitution alignment issues,
   unmapped tasks, metrics), and also show it to the user. Do not create any other file. Apart
   from `## Analysis` and `## Decided without asking`, this run does not change `tasks.md`
   unless a fix is approved (item 3).
2. **What to load from `plan.md`.** Use `## Decisions`, `## Model`, `## Contract`,
   `## Manual validation` and `## Constitution Check` in place of "Architecture/stack choices,
   Data Model references, Phases, Technical constraints".
3. **Fixes at the source.** Remediation still needs the user's approval (step 8). Once approved,
   fix each finding in the artifact where it originates (`spec.md`, `plan.md` or the task list
   of `tasks.md`) and list each fix in the run, under `**Fixes**`: finding ID → file and section
   changed. A fix that needs a new decision of architecture, UX, development standard, product
   rule or clinical matter is a question to the owner, not a fix: ask all of them together, in
   a single round, each with its category, your recommendation and the options.
4. **Extra detection passes.**
   - CRITICAL: `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/`
     in the feature directory (One artifact per phase).
   - CRITICAL: an open `[NEEDS CLARIFICATION]` marker.
   - CRITICAL: a Constitution Check item missing, unanswered, or FAIL without the owner's
     acceptance in `## Decisions`.
   - CRITICAL: a test task after an implementation task of the same story (VI).
   - HIGH: an artifact that does not end with `## Decided without asking`.
   - HIGH: an affected SP criterion without an FR, acceptance scenario or task that covers it.
   - MEDIUM: text copied from `docs/`, `spec.md` or `plan.md` instead of cited by ID or section.
5. **Decided without asking.** Record each decision this run takes without the owner in
   `## Decided without asking` of `tasks.md`: `- <decision> — source: <docs/ section | process>
   — reason: <why>`.
