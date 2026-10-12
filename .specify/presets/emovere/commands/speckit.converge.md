---
description: Assess the codebase against spec.md, plan.md and tasks.md and record each round of remaining work in the Convergence section of tasks.md (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above**, including where step 7 appends.
> It applies the constitution, Development Workflow and Quality Gates: *One artifact per phase*
> and *Who decides what*. Steps above that are not mentioned here still apply.

1. **Where the round goes.** Write each round inside the existing `## Convergence` section of
   `tasks.md`, as `### Round N — YYYY-MM-DD`, with the tasks of step 7 (same ID, format and
   ordering rules), instead of a new `## Phase N: Convergence` at the end of the file.
   `## Review` and `## Decided without asking` stay the last sections. Every other rule of the
   append-only contract still applies, and a converged result still leaves `tasks.md` unchanged.
2. **Inputs.** Load the design from `spec.md` and `plan.md` (`## Decisions`, `## Model`,
   `## Contract`, `## Manual validation`) only.
3. **Test-first.** A remediation task that changes behaviour comes after the test task that
   proves it RED (VI).
4. **Questions and decisions.** A finding that needs a new decision of architecture, UX,
   development standard, product rule or clinical matter is a question to the owner, not a
   task: ask all such questions together, in a single round, each with its category, your
   recommendation and the options. Record each decision taken without the owner in
   `## Decided without asking` of `tasks.md`:
   `- <decision> — source: <docs/ section | process> — reason: <why>`.
