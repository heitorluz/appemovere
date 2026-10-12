---
description: Create or update the feature specification from a natural language feature description (Emovere preset: spec.md only; owner questions by category).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above.** It applies the constitution,
> Development Workflow and Quality Gates: *One artifact per phase* and *Who decides what*.
> Steps above that are not mentioned here still apply.

1. **No checklist file.** Skip step 8a and step 8d: do not create `checklists/` or
   `checklists/requirements.md`. Run the validation of steps 8b and 8c in memory, against the
   items listed in step 8a plus the Emovere items below, and report pass or fail per item in the
   Completion Report. Do not write the result to any file.
   - Every SP criterion the feature affects is listed in `## Safety Criteria and References`
     (principle I).
   - Rules already written in `docs/` enter by reference (section or anchor), never rewritten.
   - SP and ADR IDs are cited (VIII).
   - Example user-facing text follows the language table in `docs/product/02-language.md` (IV).
2. **Unclear aspects** (step 6.3, step 6.5 and "For AI Generation"). "Make informed guesses" and
   "reasonable defaults" apply only to what the agent may decide without asking (below).
   Everything else is a question to the owner. The limit of 3 `[NEEDS CLARIFICATION]` markers
   does not apply to questions the owner must answer. Ask them with the format below instead of
   the `## Question [N]` table of step 8c; the other parts of step 8c still apply.
3. **Assumptions** holds only context facts with their source (for example, "depends on the
   `encrypted-storage` spec"). A default chosen by the agent is a decision: it goes to
   `## Decided without asking` or to the owner.
4. Fill `## Safety Criteria and References`. Leave `## Clarifications` empty; `/speckit-clarify`
   fills it.
5. In the feature directory, this command writes only `spec.md`.

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
of its own and never fills it in. An unanswered clinical question stays as
`[NEEDS CLARIFICATION: ...]` in the spec.

### Decided without asking

`spec.md` ends with `## Decided without asking`, one line per decision taken without the owner:
`- <decision> — source: <docs/ section | process> — reason: <why>`. Write `- None.` when empty,
and keep it the last section of the file.
