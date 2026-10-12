# Emovere preset

Local Spec Kit preset that applies two rules of the constitution
(`.specify/memory/constitution.md`, Development Workflow and Quality Gates; ADR-032):

- **One artifact per phase**: a feature produces only `spec.md`, `plan.md` and `tasks.md`. No
  command creates `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or
  `checklists/`; the spec quality check runs inside specify and clarify, without a file.
- **Who decides what**: every command that asks the owner uses the categories (Architecture,
  UX, Standard, Product rule, Clinical), with a recommendation and options, in a single round.
  Every artifact ends with `## Decided without asking`.

This folder is both the source of the preset and its installed copy.

## What it changes

| File | Strategy | Change |
|---|---|---|
| `templates/spec-template.md` | append | Safety Criteria and References, Clarifications, Decided without asking |
| `templates/plan-template.md` | replace | Decisions, Model, Contract, Manual validation, Constitution Check (I to VIII), Decided without asking |
| `templates/tasks-template.md` | replace | Test-first story phases citing IDs; Analysis, Convergence, Review, Decided without asking |
| `commands/speckit.specify.md` | wrap | Quality check without a file; owner questions by category |
| `commands/speckit.clarify.md` | wrap | One round of categorized questions; quality check without a file |
| `commands/speckit.plan.md` | wrap | Only `plan.md`; Constitution Check answered PASS or FAIL |
| `commands/speckit.tasks.md` | wrap | Reads spec and plan only; verbatim constraints come from the plan's Model section; tests mandatory |
| `commands/speckit.analyze.md` | wrap | Writes the Analysis section of `tasks.md`; fixes at the source |
| `commands/speckit.implement.md` | wrap | No checklists; RED → GREEN → REFACTOR evidence; no automatic git operations |
| `commands/speckit.converge.md` | wrap | Writes rounds in the Convergence section of `tasks.md` |
| `commands/speckit.constitution.md` | wrap | Categorized questions; entry in `constitution-history.md` |
| `commands/speckit.checklist.md` | replace | Disabled, with a pointer to specify, clarify and analyze |

`wrap` keeps the core command (`{CORE_TEMPLATE}`) and adds an "Emovere Overrides" section that
supersedes the conflicting steps, so core fixes still arrive on upgrade. `replace` is used only
where the core content contradicts the constitution and cannot be neutralized by adding text.

## Install or refresh

`specify preset add --dev` deletes its destination before copying, so it cannot install from
this folder in place. Copy the folder out first. Commands are written only for the default
integration, so switch to Codex and back to write them for both agents:

```bash
tmp="$(mktemp -d)"
cp -R .specify/presets/emovere "$tmp/emovere"
rm -rf "$tmp/emovere/.composed"
specify preset remove emovere          # skip on the first install
specify preset add --dev "$tmp/emovere"
specify integration use codex
specify integration use claude
chmod +x .specify/scripts/bash/*.sh    # integration use rewrites them without the exec bit (1.1.3)
rm -rf "$tmp"
```

## Check

```bash
specify preset resolve spec-template
specify preset resolve plan-template
specify preset resolve tasks-template
specify artifact info speckit.plan --json
```

`pnpm constitution:check` (from the `bootstrap` spec) also verifies that the spec, plan and tasks
templates end with `## Decided without asking` and that no command creates the removed artifacts.

## Upgrading Spec Kit

After `specify self upgrade`, re-read the core commands this preset wraps. The overrides cite
core steps by number (for example, "step 8a" of specify, "step 5" of clarify, "step 7" of
converge); if the core renumbers them, update the references here.
