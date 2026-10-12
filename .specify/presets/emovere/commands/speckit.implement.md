---
description: Execute the tasks in tasks.md test-first, with RED to GREEN evidence and without automatic git operations (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above.** It applies the constitution,
> Development Workflow and Quality Gates (*Flow*, *One artifact per phase*, *Who decides what*,
> *Git operations — never automatic*) and principles VI and VIII. Steps above that are not
> mentioned here still apply.

1. **Gates before any task.** `spec.md`, `plan.md` and `tasks.md` exist in the feature
   directory; `tasks.md` has at least one run under `## Analysis` (`/speckit-analyze` runs
   before implement); no `[NEEDS CLARIFICATION]` marker is open. Otherwise stop and report.
2. **No checklists.** Skip step 2. If `checklists/` exists in the feature directory, stop and
   report it as a violation of *One artifact per phase*.
3. **Context.** Read `spec.md`, `plan.md`, `tasks.md` and the constitution. Ignore every
   reference above to `data-model.md`, `contracts/`, `research.md` and `quickstart.md`; their
   content is in the `## Model`, `## Contract`, `## Decisions` and `## Manual validation`
   sections of `plan.md`.
4. **Test-first.** In every story, run its test tasks first and show RED — failing for the
   expected reason — before its implementation tasks; then GREEN. Report the commands and the
   RED → GREEN evidence in the handoff. The `bootstrap` spec is exempt from RED.
5. **docs/ in the same branch.** Changes to `docs/` that the feature requires land with the code
   (VIII).
6. **No git operations.** Never commit, push, merge, rebase, tag or open a PR unless the owner
   asks for that specific operation. Ignore "commit after each task".
7. **Questions and decisions.** A new decision of architecture, UX, development standard,
   product rule or clinical matter stops the task: ask all such questions together, in a single
   round, each with its category, your recommendation and the options. Record each decision
   taken without the owner in `## Decided without asking` of `tasks.md`:
   `- <decision> — source: <docs/ section | process> — reason: <why>`.
