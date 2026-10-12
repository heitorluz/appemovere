---
description: Identify underspecified areas in the current feature spec and resolve them with the owner in one round of categorized questions (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above.** It applies the constitution,
> Development Workflow and Quality Gates: *One artifact per phase* and *Who decides what*.
> Steps above that are not mentioned here still apply.

1. **One round.** This replaces "Do NOT output them all at once" in step 4 and the sequential
   loop of step 5. After the coverage scan, sort each candidate as below. Points the agent may
   decide are not asked: apply them to the spec and record each one in
   `## Decided without asking`. Present every question for the owner together, in a single
   message, in the format below, and wait for the answers. The limit of 5 questions does not
   apply to points the owner must decide; still leave out low-impact points.
2. **Recording.** Record the answers in the spec's existing `## Clarifications` section, under
   `### Session YYYY-MM-DD`, one bullet per answer:
   `- Q (<category>): <question> → A: <answer>`. Then integrate each answer as in step 6.
3. **No checklist file.** Skip step 9 and the checklist lines of the Completion Report and of
   Done When. Instead, re-run in memory the spec quality validation of `/speckit-specify`
   (the step 8a items plus the Emovere items) and report pass or fail per item.
4. **Open markers.** A clinical question without an answer keeps its `[NEEDS CLARIFICATION]`
   marker. Warn that `/speckit-tasks` cannot start while any marker remains open (constitution,
   Flow).
5. This command writes only `spec.md`.

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

`spec.md` ends with `## Decided without asking`, one line per decision taken without the owner:
`- <decision> — source: <docs/ section | process> — reason: <why>`. Add the lines of this phase
to the existing section. Write `- None.` when empty, and keep it the last section of the file.
