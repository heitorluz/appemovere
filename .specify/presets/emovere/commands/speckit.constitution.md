---
description: Create or amend the project constitution, with categorized owner questions and a history entry per amendment (Emovere preset).
strategy: wrap
---

{CORE_TEMPLATE}

## Emovere Overrides

> **This section supersedes the conflicting steps above.** It applies the constitution's
> Governance section and *Who decides what*. Steps above that are not mentioned here still
> apply.

1. **Source text is kept.** When the input is a full constitution document (for example, a
   draft under `docs/`), keep its wording and structure; the resolved template only guides
   headings the source lacks. Keep every `(NON-NEGOTIABLE)` marker and every
   `[NEEDS CLARIFICATION: ...]` marker unless the owner resolves it in this amendment.
2. **Questions to the owner.** The version bump, the ratification date and any change of
   meaning are the owner's. Ask all questions together, in a single round, each as
   `**Q1 · <Architecture | UX | Standard | Product rule | Clinical>** — <question>?`, with one
   sentence on why it matters, your recommendation with its reasoning, and the options.
   Changes to principles I or IV, and clinical content, also need the clinical owner once
   appointed; an agent never assumes either owner role.
3. **History.** Every amendment adds an entry at the top of
   `.specify/memory/constitution-history.md` (Governance, Versioning): date, old → new version,
   bump type, summary of the change, and the approvals. This supersedes "Write only
   `.specify/memory/constitution.md`" for that file only.
4. **Constitution Check items.** When a principle changes, check that its item in
   `.specify/presets/emovere/templates/plan-template.md` still describes it. If not, list the
   needed change under Next Actions; this command does not edit templates.
