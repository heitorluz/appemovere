---
description: Execute the implementation planning workflow and write plan.md only (Emovere preset; no research, data-model, contracts or quickstart files).
strategy: wrap
---

{CORE_TEMPLATE}

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
