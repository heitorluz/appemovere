# Emovere App Constitution

This document defines **how** the Emovere app is built. **What** the product is lives in [`docs/`](../../docs/README.md): the psychological safety criteria (SP-01 to SP-27), the language table, the ADRs and the feature specs. When this document and `docs/` diverge, the precedence rule in Governance applies.

Emovere is a self-knowledge journal that **complements, and never replaces,** professional care. It is not a medical device.

Every rule below is **normative and verifiable**. MUST and MUST NOT are obligations; a violated MUST blocks the merge. Each principle has a stable Roman ID — cite it in reviews, specs and plans (e.g., "violates II: fixture copied from a real entry").

## Core Principles

### I. Psychological Safety Before Engagement (NON-NEGOTIABLE)

_Why: tracking one's mood can help some people and harm others. The product limits its own potential for harm instead of maximizing use._

- MUST: every spec that touches check-in, insights, notifications, journaling or help list the SP criteria it affects as acceptance criteria.
- MUST: the help entry point ("Preciso de ajuda") be visible and working on every screen, in every tracking mode and offline; before unlock it shows only public resources (SP-13, SP-21).
- MUST NOT: streaks, points, achievements, completion percentages, or any message, color, notification or visual change signalling a skipped or missed check-in (SP-02, SP-03).
- MUST: after a check-in, the only response be the confirmation — no chart or insight on the spot (SP-05).
- MUST: every kind of tracking be reducible (Light, Regular, Detailed), pausable for 7 days or usable with numbers hidden, without deleting history and without guilt messaging on return (SP-12).
- MUST: notifications be generic, configurable, never at night and never triggered by absence (SP-14).
- MUST NOT: predict future emotional states; infer emotion, need, mental state, risk or behaviour; rank, score or classify the person (SP-15, ADR-002).
- MUST: the review, the session report and the onboarding always show the same help line for everyone, never tied to scores (SP-23).
- MUST NOT: open chat, simulated therapy, risk triage, or any usage metric treated as a clinical signal.

**Gate:** each `spec.md` lists the affected SP IDs; the E2E suites for help visibility (SP-13, SP-21) and for skip, pause and hidden numbers (SP-02, SP-12) block the merge.

### II. Real Data Never Leaves the Phone (NON-NEGOTIABLE)

_Why: a journal is among the most sensitive things a person writes. This repository is public, so the only leak path left is the development routine (ADR-009, ADR-018, ADR-029)._

- MUST: all user data live only in the on-device encrypted database (SQLCipher), with the key in Keychain or Keystore, excluded from system backups (SP-25, ADR-028). The key MUST NOT depend only on biometrics (SP-26).
- MUST: deleting mean destroying the key and the local database, derived data included (ADR-012).
- MUST NOT: real data — the maintainer's included — on the development machine, in the repository, fixtures, tests, logs, screenshots, issues, or prompts to AI tools (ADR-009, ADR-029).
- MUST: tests, examples and demo builds use only synthetic data generated from the personas.
- MUST NOT: log record content. Crash reports, if any, carry no content and run only with consent; the personal build has them off.
- MUST: what leaves the phone be exactly what the privacy policy lists: the static remote configuration read, the store age signal and opt-in anonymous aggregates.
- MUST NOT: advertising or analytics SDKs; network calls go only to an allow-list of domains.

**Gate:** a pre-commit hook and CI block database and export files and scan for secrets; a lint rule forbids logging record content; the **network canary test** — a unique string inside the synthetic journals — fails if that string shows up in any network request, log or crash report.

### III. The Code Calculates, AI Only Writes (NON-NEGOTIABLE)

_Why: whatever the app tells a person about their own records must be deterministic, testable and explainable (ADR-011)._

- MUST: patterns (`Pattern`) come only from deterministic domain code. The insight rule is parameterized — window length, number of windows, minimum days per group, minimum difference, evaluation interval — and returns `NO_INSIGHT` when evidence is insufficient (ADR-022, SP-06).
- MUST: at most 4 factor × outcome pairs tested and 2 insights per evaluation (SP-07). An insight taken to a session, contested or silenced MUST NOT reappear for at least 56 days unless a relevant change occurs (SP-08).
- MUST NOT: medication, food or weight, or substance use enter the engine as factors; tags created by the person never enter the engine (SP-20, ADR-023).
- MUST NOT: insights describe symptom trajectory or claim causation (SP-09).
- MUST: every insight show n, period, "pode ser coincidência" and "Por que estou vendo isso?" with the days used on a calendar, and offer: take to the session / doesn't make sense / don't track this / close (SP-10, SP-11).
- MUST: the false-insight simulation run in CI on every rule change and stay below the agreed limit (SP-22). `[NEEDS CLARIFICATION: the limit — proposal: 5% of people in 24 weeks with 4 pairs, to be calibrated with the clinical co-author]`
- MUST NOT: any AI in Phase 1. In Phase 2, if approved: the model receives only the `Pattern`, never journal text; structured output with a closed schema; a deterministic validator (every number exists in the `Pattern`; forbidden vocabulary rejected); a fixed-template fallback — the app never depends on AI to work (ADR-003, ADR-014).

**Gate:** domain unit tests and the SP-22 simulation test in CI.

### IV. Language That Complements, Never Treats (NON-NEGOTIABLE)

_Why: claims decide whether software is regulated as a medical device, and words can judge or frighten someone on a bad day._

- MUST: user-facing text follow the language table in `docs/`: self-knowledge, not treatment; "complementa, não substitui"; association, not cause; autonomy ("se fizer sentido"), never obligation.
- MUST NOT: diagnoses, "piorou", "falhou", "meta não atingida", "você deve", or AI in the first person ("eu", "percebi", "estou preocupado") (SP-04, ADR-002).
- MUST NOT: README, store listing, site or any public material promise treatment or name therapeutic approaches or conditions, until the regulatory answers recorded in `docs/` allow it. Public material states that Emovere is not a medical device.
- MUST: clinical content — help texts, the universal help line, the factor list, the journal safety-net list — stay marked as draft until the clinical co-author reviews it and the decision is recorded in the Clinical Decision Log.

**Gate:** the term linter (SP-04) runs on content and translation files in CI and blocks the merge.

### V. Dependency Rule Points Inward (NON-NEGOTIABLE)

_Why: the domain must be testable without the app, the database or the network, and swapping a storage engine or an AI provider must not touch a rule._

- MUST: `packages/domain` be pure TypeScript — no React, Expo, database, network, real clock or global identifiers.
- MUST: storage, secure key, biometrics, notifications and AI providers sit behind ports declared in the domain; adapters live in the app; a single composition root wires ports to adapters.
- MUST: modules expose explicit internal APIs and never read another module's tables.
- MUST NOT: the app import code from the AI lab repository. Shared contracts — the `Pattern` schema and the content export — are versioned and published by this repository (ADR-030).

**Gate:** `pnpm architecture:check` in CI.

### VI. Test-First, Red-Green-Refactor (NON-NEGOTIABLE)

_Why: it is what makes "pure domain" and the safety criteria observable._

- MUST: write the test before the implementation and prove RED — failing for the expected reason.
- MUST: every domain invariant have a unit test without infrastructure.
- MUST: every adapter have an integration test against the real encrypted database with real migrations: migrations preserve data, the database does not open without the key, deletion makes it unreadable.
- MUST: the remote-configuration brake be tested function by function: each one can be switched off, the file cannot switch anything on, and offline the safe default applies (SP-24).
- MUST: critical journeys have Maestro E2E tests on iOS and Android: check-in → evening log → review → report; help before unlock, with public resources only, in airplane mode; export, import and delete.
- MUST: the contract published for the AI lab have a contract test.
- MUST: every new screen be checked with VoiceOver, TalkBack and large fonts.
- MUST NOT: use line coverage as an acceptance criterion; the measure is covered invariants and SP criteria.
- MUST: in `tasks.md`, test tasks precede implementation tasks for each story.
- Exception: `bootstrap` is exempt from RED as a whole and MUST leave the runners and suites installed.

**Gate:** test tasks before implementation tasks in `tasks.md`; commits or handoff show RED → GREEN.

### VII. Minimal Effective Interaction, Local-First

_Why: the ideal is thirty seconds in the morning, living one's life, and thirty seconds at night. Less infrastructure is also less risk for a project that starts with one person._

- MUST NOT: features designed to maximize sessions, notifications or minutes of use.
- MUST NOT: an own server in Phase 1. The only mandatory network read is a static remote configuration that can only switch features off, with a safe embedded default when offline (ADR-024, SP-24).
- MUST: remote updates only with code signing; without it, updates go through the stores.
- MUST: three builds — personal (the maintainer's real data, only on the maintainer's phone), development and demo (synthetic personas).
- MUST NOT: add a dependency, layer or abstraction without a need stated in a spec.

### VIII. Documentation and Code in Agreement (NON-NEGOTIABLE)

_Why: the documentation states limits, trade-offs, known failures and revisable decisions — in public._

- MUST: specs and plans cite SP and ADR IDs; when a rule changes, `docs/` and code change in the same PR.
- MUST: each release review the hazard log kept by the owner and record what changed.
- MUST: sensitive features meet the sensitive-feature Definition of Done (below) before anyone other than the maintainer uses them.

## Technical Constraints and Stack

- **Language and tooling:** TypeScript in strict mode; pnpm workspaces; ESLint, Prettier and Husky; GitHub Actions.
- **App:** Expo (current SDK) with Expo Router; UI on NativeWind with React Native Reusables (alternatives: Tamagui or gluestack-ui); the official visual direction "Linho e anil" (tokens ported to `docs/`).
- **Device:** expo-sqlite with SQLCipher; expo-secure-store for the key; expo-local-authentication for biometrics; expo-notifications for local reminders only.
- **Persistence:** Drizzle ORM over expo-sqlite. `[NEEDS CLARIFICATION: a spike must confirm Drizzle works with the SQLCipher-encrypted database; otherwise, hand-written SQL repositories behind the same ports]`
- **Schemas and contracts:** Zod for entities, the remote configuration and the contract published for the AI lab (exported as JSON Schema).
- **Forms:** React Hook Form with Zod.
- **Charts:** a native chart library (e.g., Victory Native), with labels and screen-reader descriptions.
- **Tests:** Vitest for the domain; React Native Testing Library for components; Maestro for E2E.
- **Backups and keyboard:** `android.allowBackup` off; iOS backup exclusion on the database files; suggestions and learning off in journal fields.
- **Out of scope in Phase 1 (decision, not oversight):** any backend (NestJS, Redis, PostgreSQL), TanStack Query, MUI and AI.
- `[NEEDS CLARIFICATION: where the project site lives — privacy policy, support page and the static remote configuration]`

## Development Workflow and Quality Gates

**Flow**

- MUST: every feature follow `/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.analyze → /speckit.implement → manual review`, on a branch named `###-feature-name`. `/speckit.converge` is optional after implement.
- MUST NOT: start implementation without `spec.md`, `plan.md` and `tasks.md` in the feature folder.
- MUST NOT: leave a `NEEDS CLARIFICATION` marker open when entering `/speckit.tasks`.
- MUST: open questions about clinical content, factors, thresholds or help texts go to the owner and, once appointed, the clinical co-author. An agent MUST NOT fill them in.
- MUST: `plan.md` contain the Constitution Check, answered item by item.

**One artifact per phase** — a feature produces only `spec.md`, `plan.md` and `tasks.md`.

_Why: when the same information lives in eight or ten files, every change has to be copied into all of them, and the copies drift apart._

| Phase | Artifact | What it records |
|---|---|---|
| Specify | `spec.md` | What and why: user stories, acceptance scenarios, edge cases, requirements and the affected SP criteria. Rules already in `docs/` enter **by reference** (section or anchor), never rewritten. |
| Clarify | `spec.md` | Questions and answers in the `Clarifications` section. |
| Plan | `plan.md` | How: `Decisions` (ID, decision, chosen, discarded, reason), `Model` (only what changes), `Contract`, `Manual validation` (only what E2E does not cover) and the Constitution Check. |
| Tasks | `tasks.md` | The tasks, citing spec and plan IDs (US1, FR-003, D2, SP-05) instead of copying text. |
| Analyze | `tasks.md` | Findings and fixes in the `Analysis` section. |
| Implement | code and `docs/` | Tasks checked in `tasks.md`; `docs/` updated in the same PR (VIII). |
| Converge | `tasks.md` | Each round in the `Convergence` section. |
| Manual review | `tasks.md` | The result in the `Review` section. |

- MUST NOT: create `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/`. The spec quality check still runs, as a step of specify and clarify, without a file.
- MUST: each piece of information live in one place — product rule in `docs/`; expected behaviour and acceptance in `spec.md`; technical decision and contract in `plan.md`; execution, tracking and the records of the checking phases in `tasks.md`. Other artifacts cite by ID and never copy the text.
- MUST: a phase write only to its own artifact. An error found in another phase's artifact is fixed at its source, and the fix is recorded in the current phase's artifact.

**Who decides what** — the agent decides what is already decided or is process; the owner decides what is new.

_Why: asking the owner what `docs/` already answers spends their attention where it is not needed, and deciding alone what nobody decided puts an ownerless rule into a health product. The line between the two is whether the decision already exists in writing._

- MUST: the agent decide without consulting the owner (1) documentation and process — format and wording of artifacts, success criteria and tasks, where to record each thing, the organization of the spec, synthetic data and test infrastructure within existing patterns; and (2) what `docs/` writes clearly — including the ADRs and decisions already recorded for another module. Applying what is written is not a new decision: MUST cite the section used as source.
- MUST: go to the owner (3) a **new** decision of architecture, UX or development standard, and (4) a product rule that `docs/` does not write clearly.
- MUST: clinical matters — content, factors, thresholds, help texts, crisis resources — not written and approved in `docs/` go to the owner and, once appointed, the clinical co-author, as above. Being clear elsewhere does not make them decided.
- MUST NOT: use as a decision source a document that `docs/` superseded (such as the original EPIC v1) or another app (a product reference, not a decision). If that is the only basis, the question goes to the owner, and the source appears in it only as context.
- "Clear" means written explicitly, without two possible readings. When in doubt, it is not clear: ask.
- MUST: each question to the owner carry its category (Architecture, UX, Standard, Product rule or Clinical), the agent's recommendation and the options, and the questions of a phase go together, in a single round.
- MUST: every feature artifact end with the section `## Decided without asking`, one line per decision taken without the owner: decision, source (a `docs/` section or "process") and reason; "None." when empty. Specify and Clarify record in `spec.md`; Plan in `plan.md`; Analyze, Converge and Review in `tasks.md`. The owner reviews them all in the manual review and may veto any.

**Gates**

- MUST: before opening a PR, run `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm architecture:check`, `pnpm constitution:check`, the term linter (IV) and the data-leak checks (II). CI runs the same gates from `bootstrap` on.
- MUST: run `/speckit.analyze` before `/speckit.implement`.
- MUST: `pnpm constitution:check` also verify that the spec, plan and tasks templates end with the `Decided without asking` section and that no command creates the artifacts removed by **One artifact per phase**.
- MUST: PR reviews cite principles by ID; a violated MUST blocks.

**Git operations — never automatic**

_Why: in a public repository a commit is a publication. Once in history, content is hard to remove and may already be replicated._

- MUST NOT: an agent create a commit without an explicit request or manual approval from the owner. Approval is per operation: a commit does not authorize the next one, nor a push.
- MUST NOT: without an explicit request — push, force push, merge, rebase, cherry-pick, `reset --hard`, create or move tags, rewrite history, open or close PRs, publish releases.
- MUST: before a requested commit, present what goes in and flag any file not changed in the session.
- MUST NOT: use `git add -A` or `git add .` without inspecting the staging area; unexpected files leave staging and are reported.
- MUST NOT: commit directly to the default branch.

**Definition of Done per story**

- MUST: invariants covered by domain tests; adapters by integration tests; affected SP criteria covered.
- MUST: `docs/` in agreement with the delivered code (VIII).
- MUST: handoff with the commands run and the RED → GREEN evidence.
- MUST: the `Review` section of `tasks.md` record the result (`**Result**:` approved or changes requested) and the owner's verdict on the `Decided without asking` lines.

**Sensitive-feature Definition of Done** — a feature that processes the journal, computes or writes insights, suggests actions or shows crisis resources only reaches anyone other than the maintainer when there is:

- objective, benefit and foreseeable harm described;
- related hazards updated in the hazard log;
- clinical and product decision recorded;
- minimal data, purpose and retention approved;
- normal, edge and adversarial test cases;
- failure handling and a fallback **without AI**;
- applicable SP criteria approved;
- interface text checked against the language table and reviewed for accessibility, UX and clinical content;
- no number displayed outside its `Pattern`;
- a success metric that does not depend on increasing compulsive use;
- an owner identified for operation, incidents and rollback.

## Constitution Check

The canonical items live in the plan template provided by the local `emovere` preset (`.specify/presets/emovere/templates/plan-template.md`; `specify preset resolve plan-template` shows the effective file) and are copied into the Constitution Check section of each `plan.md`, answered PASS or FAIL item by item. An amendment that changes a principle MUST check that the corresponding template item still describes it.

## Governance

**Owners**

- **Technical owner:** Heitor Luz, repository maintainer. Approves amendments and decides what **Who decides what** sends to the owner.
- **Clinical owner:** the clinical co-author, a licensed psychologist. `[NEEDS CLARIFICATION: to be appointed]` Approves changes to principles I and IV and to clinical content. Until appointed, clinical content stays draft and no one other than the maintainer uses the app with real data.
- MUST NOT: an agent or contributor assume either role by inference.

**Precedence** — from strongest to weakest:

1. This constitution — **how** to build: architecture, process, quality.
2. `docs/` — **what** the product is: safety criteria, language table, ADRs and product decisions.
3. The feature spec.
4. Existing code — precedent does not create rules.

A divergence between `docs/` and code is never an acceptable state: it is resolved in the same PR, in either direction (VIII). This constitution MUST NOT contain product rules beyond those it cites by ID.

**Versioning** — SemVer applied to this document: MAJOR to remove or redefine a principle incompatibly or change governance; MINOR to add a principle or section or materially expand a rule; PATCH for wording without semantic change. Dates in ISO format. Every amendment adds an entry at the top of `constitution-history.md`.

**Amendment** — via a dedicated PR, using `/speckit.constitution`, with `pnpm constitution:check` green and the owner's approval; when principles I or IV change, also the clinical owner's.

**Version**: 1.0.0 | **Ratified**: 2026-10-12 | **Last Amended**: 2026-10-12
