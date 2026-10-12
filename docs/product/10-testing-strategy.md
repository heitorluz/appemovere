# Testing strategy

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

Development is test-driven (TDD).

## Process (ADR-031)

Spec-driven development with Spec Kit in both repositories.

- The constitution is derived from this product specification. The draft for review is in [constitution-draft.md](../constitution-draft.md).
- One spec per journey or screen, with the SP criteria as acceptance criteria.
- Open questions become `NEEDS CLARIFICATION`. Clinical ones (content, factors, thresholds, help texts) are never filled in by an agent.
- CI gates for the constitution, architecture, language (SP-04) and data leaks. The definition of done in [Appendix A](appendix-sensitive-feature-dod.md) becomes a checklist.
- **One artifact per phase (ADR-032):** each spec produces only `spec.md` (specify and clarify), `plan.md` (decisions, model, contract, manual validation and Constitution Check) and `tasks.md` (tasks, analysis, convergence and review). `research.md`, `data-model.md`, `contracts/`, `quickstart.md` and `checklists/` are not used. Each piece of information lives in one place only (product rules in `docs/`, acceptance in `spec.md`, technical decisions and contracts in `plan.md`, execution and records in `tasks.md`); the other artifacts cite it by ID.
- **Who decides what (ADR-032):** the agent decides on its own about documentation, process, and anything that `docs/` states clearly, citing the section. These go up to the owner: any new architecture, UX or development-pattern decision; any product rule that is not clear; and any clinical question not yet approved, which also goes to the clinical co-author. Superseded documents and other apps are not valid sources. Each question carries a category, a recommendation and options, in one round per phase. Every artifact ends with `Decided without asking`, which the owner reviews in the manual review and can veto.

## Test layers

| Layer | Focus | Examples |
|---|---|---|
| Domain | Pure rules and invariants | A `Pattern` cannot exist with n below the minimum; a forbidden factor never enters (SP-20); the report does not include an item that was not selected; revoked consent blocks sending. |
| Engine | False insight (SP-22) | The simulation runs in CI; the false-insight rate stays below the agreed limit (proposal: 5% of people over 24 weeks, with 4 pairs). |
| Application | Use cases and ports | Deletion destroys the key; an insight without AI uses the fixed template. |
| Integration | Local database and device | Migrating the encrypted database preserves data; the database does not open without the key; deleting makes the database unreadable; the database is excluded from backup on both systems (SP-25); changing biometrics does not erase data (SP-26). |
| Emergency brake | Remote configuration (SP-24) | Each feature can be turned off; the file cannot turn anything on; without internet, the safe default applies. |
| E2E | Critical journeys on iOS and Android (Maestro) | Check-in → evening log → review → report; help before unlock, with public resources only, and in airplane mode; export, import and delete. |
| Contract (Phase 2) | APIs and schemas | The client generated from OpenAPI compiles against the API. |
| Validator (Phase 2) | AI outputs | A number not in the `Pattern` is rejected; forbidden vocabulary is rejected. |
| Security | Threats and regressions | **Network canary test:** a unique string in the synthetic journals; the test fails if it appears in any network request, log or crash report. An allow-list of domains; no ad or analytics library. |
| Accessibility and UX | Use under stress and low energy | VoiceOver and TalkBack; large fonts; React Native Testing Library; error recovery; testing on a real entry-level Android phone. |
| Psychological safety | Criteria SP-01 to SP-27 (see [Clinical safety](07-clinical-safety.md)) | Text linter in CI; engine tests; E2E for skipping, pausing, hiding numbers, and help visible in all modes. |

## Test data

Synthetic data and de-identified fixtures are required for CI, demos and evals. This also applies to the maintainer's personal build: no real entry from it goes into fixtures, evals, screenshots, issues or prompts.
