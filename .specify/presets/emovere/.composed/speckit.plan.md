---
description: Execute the implementation planning workflow and write plan.md only (Emovere
  preset; no research, data-model, contracts or quickstart files).
scripts:
  sh: scripts/bash/setup-plan.sh --json
  ps: scripts/powershell/setup-plan.ps1 -Json
  py: scripts/python/setup_plan.py --json
---



## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before planning)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_plan` key
- If the YAML cannot be parsed or is invalid, do not skip silently: tell the user that `.specify/extensions.yml` could not be read (include the parser error) and that no hooks were checked, including any mandatory (`optional: false`) hooks registered there, then continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```
    After emitting the block above you MUST actually invoke the hook and wait for it to finish before continuing. Run it the same way you would run the command yourself in this agent/session (the invocation may differ from the literal `{command}` id shown above, e.g. a skills-mode agent runs it as `/skill:speckit-...` or `$speckit-...`). Emitting the block alone does not run the hook.
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

1. **Setup**: Run `{SCRIPT}` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, FEATURE_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Re-evaluate Constitution Check post-design

## Mandatory Post-Execution Hooks

**You MUST complete this section before reporting completion to the user.**

Check if `.specify/extensions.yml` exists in the project root.
- If it does not exist, or no hooks are registered under `hooks.after_plan`, skip to the Completion Report.
- If it exists, read it and look for entries under the `hooks.after_plan` key.
- If the YAML cannot be parsed or is invalid, do not skip silently: tell the user that `.specify/extensions.yml` could not be read (include the parser error) and that no hooks were checked, including any mandatory (`optional: false`) hooks registered there, then continue to the Completion Report.
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Mandatory hook** (`optional: false`) — **You MUST emit `EXECUTE_COMMAND:` for each mandatory hook**:
    ```
    ## Extension Hooks

    **Automatic Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}
    ```
    After emitting the block above you MUST actually invoke the hook and wait for it to finish before continuing. Run it the same way you would run the command yourself in this agent/session (the invocation may differ from the literal `{command}` id shown above, e.g. a skills-mode agent runs it as `/skill:speckit-...` or `$speckit-...`). Emitting the block alone does not run the hook.
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```

## Completion Report

Command ends after Phase 1 design. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define interface contracts** (if project has external interfaces) → `/contracts/`:
   - Identify what interfaces the project exposes to users or other systems
   - Document the contract format appropriate for the project type
   - Examples: public APIs for libraries, command schemas for CLI tools, endpoints for web services, grammars for parsers, UI contracts for applications
   - Skip if project is purely internal (build scripts, one-off tools, etc.)

3. **Create quickstart validation guide** → `quickstart.md`:
   - Document runnable validation scenarios that prove the feature works end-to-end
   - Include prerequisites, setup commands, test/run commands, and expected outcomes
   - Use links or references to contracts and data model details instead of duplicating them
   - Do not include full implementation code, model/service/controller bodies, migrations, or complete test suites
   - Keep this artifact as a validation/run guide; implementation details belong in `tasks.md` and the implementation phase

**Output**: data-model.md, /contracts/*, quickstart.md

## Key rules

- Use absolute paths for filesystem operations; use project-relative paths for references in documentation
- ERROR on gate failures or unresolved clarifications

## Done When

- [ ] Plan workflow executed and design artifacts generated
- [ ] Extension hooks dispatched or skipped according to the rules in Mandatory Post-Execution Hooks above
- [ ] Completion reported to user with branch, plan path, and generated artifacts


## Emovere Overrides

> **This section supersedes the conflicting steps above**, including the Phases, the Completion
> Report and Done When. It applies the constitution, Development Workflow and Quality Gates:
> *One artifact per phase* and *Who decides what*. Steps above that are not mentioned here
> still apply.

1. **Only `plan.md`.** Do not create `research.md`, `data-model.md`, `contracts/` or
   `quickstart.md`, and do not dispatch agents that write files. The content of Phase 0 and
   Phase 1 goes into the sections of `plan.md`:
   - research, decisions and alternatives → `## Decisions` (ID, decision, chosen, discarded,
     reason);
   - entities → `## Model`, only what changes, with each constraint written precisely, because
     `/speckit-tasks` quotes these constraints verbatim;
   - interface contracts → `## Contract`;
   - the quickstart validation → `## Manual validation`, only what automated tests do not cover.
2. **No Technical Context section.** The stack and its limits are in the constitution
   (Technical Constraints and Stack). Cite it; record in `## Decisions` only what this feature
   chooses. Do not add a Complexity Tracking section.
3. **Open points.** Research does not resolve a `[NEEDS CLARIFICATION]` that the owner must
   decide. Sort every open point as below and ask the owner in a single round. A technical
   unknown the agent can settle by reading `docs/` or the code is a decision with its source.
4. **Constitution Check.** Answer every item of the template (I to VIII) PASS or FAIL, with the
   evidence, before filling the other sections and again at the end. A FAIL is an ERROR unless
   the owner accepts it; record the acceptance in `## Decisions` with the owner's answer.
5. **Errors in spec.md.** Fix them in `spec.md`, their source, and record each fix in
   `## Decided without asking` of `plan.md` (constitution: a phase writes only to its own
   artifact; an error found in another phase's artifact is fixed at its source).
6. **Completion Report.** Report the branch, the path of `plan.md` and the Constitution Check
   result. There are no other generated artifacts.

### Questions to the owner

Sort every open point before asking:

- **Decide without asking** and record it in `## Decided without asking`: documentation and
  process (format and wording of artifacts, success criteria and tasks, where each thing is
  recorded, the organization of the spec, synthetic data and test infrastructure within existing
  patterns); and anything `docs/` writes clearly, including the ADRs and decisions recorded for
  another module. Cite the `docs/` section used.
- **Ask the owner**: a new decision of architecture, UX or development standard; a product rule
  that `docs/` does not write clearly; any clinical matter (content, factors, thresholds, help
  texts, crisis resources) not written and approved in `docs/`, even if it is clear elsewhere.
- "Clear" means written explicitly, with only one possible reading. When in doubt, ask.
- Never use as a decision source a document that `docs/` superseded (such as the original
  EPIC v1) or another app. If that is the only basis, ask, and cite it only as context.

Ask all the questions of this phase together, in a single round, and wait for the answers:

```markdown
**Q1 · <Architecture | UX | Standard | Product rule | Clinical>** — <full question ending in ?>
<One sentence: why it matters for this feature.>

- **Recommended: B** — <one or two sentences of reasoning, citing docs/ when relevant>
- **A.** <option> — <implication>
- **B.** <option> — <implication>
- **C.** <option> — <implication>

Reply with `Q1: B, Q2: recommended, Q3: <short answer>`.
```

Clinical questions go to the owner and, once appointed, the clinical co-author. For them, the
recommendation is about process (for example, keep the item as a draft marked for clinical
review) or cites a proposal already written in `docs/`; the agent never proposes clinical content
of its own and never fills it in.

### Decided without asking

`plan.md` ends with `## Decided without asking`, one line per decision taken without the owner:
`- <decision> — source: <docs/ section | process> — reason: <why>`. Write `- None.` when empty,
and keep it the last section of the file.
