# Feature Specification: Bootstrap — repository foundations and gates

**Feature Branch**: `001-bootstrap`

**Created**: 2026-10-12

**Status**: Draft

**Input**: The `bootstrap` row of [docs/roadmap/spec-plan.md](../../docs/roadmap/spec-plan.md) (Milestone A; GitHub issue #1), with the details given by the owner on 2026-10-12: monorepo and test runners, gates in CI and before each commit, the ADR-029 routine protections, agent hooks, project agents and commands from a single source (`.ia/`), editor recommendations, and `docs/` updated in the same PR. It builds on the Spec Kit setup done as step zero (Spec Kit 1.1.3, the local `emovere` preset, the `claude` and `codex` integrations, the `git` and `github` extensions, constitution 1.0.0).

## User Scenarios & Testing *(mandatory)*

Actors: the **maintainer** (the technical owner, who also writes code), **contributors** (anyone opening a pull request or an issue) and the **AI coding agents** used in development (Claude Code and Codex). Nobody in this spec handles real data: every input and fixture is synthetic.

### User Story 1 - Every change passes the constitution's gates before it merges (Priority: P1)

The maintainer opens a pull request. Continuous integration runs every gate the constitution lists (Development Workflow and Quality Gates, *Gates*) and the pull request cannot merge while any gate fails.

**Why this priority**: the constitution says a violated MUST blocks the merge and that CI runs the gates "from `bootstrap` on". Every later spec depends on these gates already working.

**Independent Test**: open a pull request that breaks one gate at a time (a type error, a lint error, a formatting error, a failing test, a forbidden import into the domain, a template without `## Decided without asking`, a forbidden term in a content file, a synthetic database file); each one fails its gate, and a clean pull request passes all of them.

**Acceptance Scenarios**:

1. **Given** a pull request with no violations, **When** CI runs, **Then** every gate (FR-010) reports success.
2. **Given** a pull request where the domain package imports a UI or database library, **When** CI runs, **Then** the architecture gate fails and names the offending import.
3. **Given** a pull request that changes a gate script, **When** CI runs, **Then** the changed gate runs with the new script in that same pull request.
4. **Given** any failing gate, **When** the maintainer looks at the pull request, **Then** the merge is blocked until the gate passes.
5. **Given** a function in `packages/domain` above a Clean Code limit (for example, complexity above 10), **When** lint runs, **Then** it fails and names the rule (FR-010b).
6. **Given** a `domain/` file that imports from an `application/` folder, or a context that imports another context's `domain/`, **When** CI runs, **Then** the architecture gate fails (FR-012).

---

### User Story 2 - Real data and secrets are stopped before they leave the machine (Priority: P1)

A database file, an export or a secret ends up in the working tree by mistake. The commit is refused on the maintainer's machine, and if the local check was skipped, CI refuses it in the pull request.

**Why this priority**: the repository is public from the first commit; the only leak path left is the development routine (principle II, ADR-009, ADR-029). A leaked journal cannot be taken back.

**Independent Test**: with synthetic files only, try to commit a file with each blocked extension, a file with a database header under another extension, and a synthetic fake secret; each commit is refused with a message naming the file and the rule. Repeat with the local check bypassed and confirm CI fails.

**Acceptance Scenarios**:

1. **Given** a synthetic `.db`, `.sqlite`, `.realm`, `.enc` or `.emovere-export` file staged anywhere in the repository, **When** the maintainer commits, **Then** the commit is refused and the message names the file and the reason.
2. **Given** a staged synthetic file that looks like a credential (a test token with a known secret format), **When** the maintainer commits, **Then** the commit is refused.
3. **Given** a commit that skipped the local check, **When** its pull request runs CI, **Then** the data-leak gate fails for the same file.
4. **Given** any logging call in `apps/mobile` or `packages/domain`, **When** lint runs, **Then** it fails and points to the call (FR-021).
5. **Given** a contributor opening an issue, **When** they choose any issue form, **Then** they see the warning to never paste real content and the crisis resources, before writing anything.

---

### User Story 3 - The monorepo builds and every test suite runs (Priority: P2)

A fresh clone installs with one command; the domain package and the mobile app type-check, and their test suites run locally and in CI.

**Why this priority**: the gates of US1 need code to check, and the specs that follow (`domain-checkin-and-patterns`, `encrypted-storage`, `app-shell-and-help`) start by writing tests in these packages (principle VI).

**Independent Test**: on a clean clone, run the install and then each gate locally; all pass. Add a synthetic failing test to each suite and confirm the test gate fails.

**Acceptance Scenarios**:

1. **Given** a clean clone, **When** the maintainer runs the install and the test command, **Then** the domain suite and the mobile suite both run and pass.
2. **Given** the domain package, **When** anything in it imports React, Expo, a database, the network or a real clock, **Then** the architecture gate fails (principle V).
3. **Given** the end-to-end tool configuration, **When** the maintainer reads the docs, **Then** they find where flows go and how to run them; the first flows arrive with `app-shell-and-help`.

---

### User Story 4 - The language gate catches forbidden terms (Priority: P2)

Any user-facing text in content or translation files that contains a term forbidden by SP-04 fails the build.

**Why this priority**: SP-04 is a psychological safety criterion and the term linter is the mitigation of hazard H-06. The linter has to exist before the first screen text does.

**Independent Test**: run the linter against synthetic fixture files containing each forbidden term, in different cases and inside longer words; it flags each whole-word occurrence and nothing else.

**Acceptance Scenarios**:

1. **Given** a content file with "Você deve" or "você deve", **When** the term linter runs, **Then** it fails and reports the file, the line and the SP-04 term.
2. **Given** a content file with "seu" or "meu", **When** the term linter runs, **Then** it does not flag them as "eu" (whole words only).
3. **Given** a content or translation file changed by an AI agent, **When** the agent's edit completes, **Then** the agent hook runs the same linter and reports the result to the agent.

---

### User Story 5 - The Spec Kit process is guarded (Priority: P2)

The constitution check verifies that the process rules of *One artifact per phase* and *Who decides what* still hold in the templates and commands that Spec Kit actually resolves.

**Why this priority**: the constitution requires `pnpm constitution:check` to verify these rules; without it, a Spec Kit upgrade or a preset edit could silently bring back the removed artifacts.

**Independent Test**: in a scratch copy, remove `## Decided without asking` from a template, or make a command write `research.md`; the constitution check fails and says which rule broke.

**Acceptance Scenarios**:

1. **Given** the spec, plan and tasks templates as Spec Kit resolves them, **When** the constitution check runs, **Then** it passes only if each one ends with `## Decided without asking`.
2. **Given** the commands as Spec Kit resolves them, **When** the constitution check runs, **Then** it fails if any of them instructs creating `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/`.
3. **Given** the plan template, **When** the constitution check runs, **Then** it passes only if its Constitution Check has one item per principle, I to VIII.
4. **Given** a feature directory under `specs/`, **When** the constitution check runs, **Then** it fails if that directory contains any of the removed artifacts.

---

### User Story 6 - Project agents and commands come from a single source (Priority: P3)

The maintainer edits an agent or a command once, in `.ia/`, and a sync command writes the copies each AI tool reads, without touching the files Spec Kit generates.

**Why this priority**: the same rules must reach both AI tools without being copied by hand (principle VIII, *One artifact per phase*: each piece of information lives in one place). It is useful from the next spec on, but the gates of US1 to US5 come first.

**Independent Test**: change one agent in `.ia/`, run the sync, and confirm both tools' copies change while every Spec Kit-generated file stays byte-for-byte identical; change a copy by hand and confirm CI reports the drift.

**Acceptance Scenarios**:

1. **Given** an agent defined in `.ia/`, **When** the maintainer runs `pnpm ai:sync`, **Then** the Claude Code and Codex copies are written from it.
2. **Given** a Spec Kit-generated file on the explicit list (FR-031), **When** `pnpm ai:sync` runs, **Then** the file is not changed; if a source in `.ia/` would write to that path, the sync stops with an error.
3. **Given** a generated copy edited by hand, **When** CI runs, **Then** it fails and says to edit `.ia/` and run the sync.
4. **Given** any project agent, **When** it answers, **Then** it has not written files, has not run git, has turned clinical questions into `[NEEDS CLARIFICATION]`, and its artifact ends with `## Decided without asking`.

---

### User Story 7 - Agent hooks enforce the same rules as the scripts (Priority: P3)

When an AI agent tries to write a database or export file, its hook calls the data-file check and the write is blocked; when it changes a content or translation file, its hook calls the term linter.

**Why this priority**: agents write files fast and in bulk; catching the problem at the write is cheaper than at the commit. CI and the commit check remain the backstop, so this comes after them.

**Independent Test**: ask each agent tool to create a synthetic `.db` file; the write is refused by the hook with the same message the commit check gives.

**Acceptance Scenarios**:

1. **Given** an agent attempting to write `something.sqlite`, **When** the hook runs, **Then** the write is blocked and the message comes from the data-file check script.
2. **Given** a change to a rule (for example, a new blocked extension), **When** it is made in the script, **Then** the commit check, CI and both agents' hooks apply it with no other change.

---

### User Story 8 - The editor recommends the right extensions (Priority: P3)

A contributor opening the repository in VS Code is offered the project's recommended extensions and is told which one is unwanted.

**Why this priority**: convenience that also keeps database viewers and other AI assistants away from the project (principle II); it carries no risk of its own.

**Independent Test**: open the repository in VS Code; the recommendation prompt lists exactly the extensions of FR-040 and marks the unwanted one.

**Acceptance Scenarios**:

1. **Given** a fresh clone opened in VS Code, **When** the recommendations prompt appears, **Then** it lists the extensions of FR-040 and none other.
2. **Given** the editor settings folder, **When** files other than the recommendations are created locally, **Then** they stay out of git.

---

### Edge Cases

- A commit made with the local check bypassed: CI runs the same data-leak and secret checks and fails the pull request (US2).
- An AI tool without hook support, or with hooks turned off: the commit check and CI still apply the same scripts (US7).
- A database file renamed with an unrelated extension: blocked when its content carries a recognizable database header. An encrypted file with no header and an unrelated extension is not detectable by content; it is covered by the blocked extensions, the `exports/` folder and the rule that real data never reaches the machine (principle II).
- A forbidden term inside a longer word ("eu" in "seu"), in another case ("VOCÊ DEVE") or with or without accents: whole-word, case-insensitive matching (US4).
- Forbidden terms quoted in `docs/` as examples of what to avoid (for example in [07-clinical-safety.md](../../docs/product/07-clinical-safety.md)): `docs/` is not a content or translation file, so the linter does not run on it (SP-04, "How to test").
- No content or translation files exist yet: the term linter passes on an empty set and is proven by its own fixture tests.
- `pnpm ai:sync` meets a path that Spec Kit also generates: it stops with an error and changes nothing (US6).
- A Spec Kit upgrade or preset refresh changes the resolved templates or commands: the constitution check runs on the resolved result, not on the preset source alone (US5).
- A commit authored with a personal email instead of the GitHub no-reply address: the commit check refuses it ([09-architecture.md](../../docs/product/09-architecture.md), ADR-029 protections).

## Requirements *(mandatory)*

### Functional Requirements

**Monorepo and runners (US3)**

- **FR-001**: The repository MUST be a pnpm workspace with `apps/mobile` and `packages/domain`, as laid out in [09-architecture.md](../../docs/product/09-architecture.md) and ADR-001. `apps/api`, `packages/content` and any Python folder MUST NOT be created (ADR-030; out of scope).
- **FR-002**: `apps/mobile` MUST be an Expo app (current SDK) with Expo Router and TypeScript in strict mode (ADR-010; constitution, Technical Constraints and Stack). It MUST contain no route and no screen: the first screen arrives with `app-shell-and-help`, together with the help entry point that principle I requires on every screen.
- **FR-003**: `packages/domain` MUST be pure TypeScript in strict mode with no dependency on React, Expo, a database, the network, a real clock or global identifiers (principle V). It MUST contain no domain entity or rule (out of scope; `domain-checkin-and-patterns`).
- **FR-004**: Vitest MUST run the domain suite, and React Native Testing Library MUST run the mobile suite; each suite MUST contain at least one passing test that proves the runner is wired.
- **FR-005**: Maestro MUST be configured (where flows live, how to run them), with the first flows delivered by `app-shell-and-help` ([spec-plan](../../docs/roadmap/spec-plan.md), Milestone A).
- **FR-006**: This spec is exempt from RED as a whole and MUST leave the runners and suites installed (principle VI, exception).

**Gates (US1, US4, US5)**

- **FR-010**: The repository MUST provide these gates as pnpm scripts: `typecheck`, `lint`, `format:check`, `test`, `architecture:check`, `constitution:check`, the term linter and the data-leak checks (constitution, *Gates*).
- **FR-010a**: `format:check` and `lint` MUST cover code and configuration (TypeScript, JavaScript, JSON, YAML) and MUST exclude Markdown, `docs/`, `specs/` and the files Spec Kit generates (`.specify/`, `.claude/skills/speckit-*`, `.agents/skills/speckit-*`).
- **FR-010b**: `lint` MUST enforce the Clean Code limits of the constitution (Technical Constraints and Stack) in `packages/domain` and `apps/mobile`, with tests exempt from the function-length limit.
- **FR-011**: CI MUST run every gate of FR-010 on every pull request, and the pull request MUST NOT merge while any gate fails.
- **FR-012**: `architecture:check` MUST fail when `packages/domain` imports anything forbidden by FR-003; when a layer imports outward (a `domain/` folder importing `application/` or adapters; an `application/` folder importing adapters; `packages/domain` importing `apps/`); when a bounded context imports another context's `domain/` instead of its application API; when `shared/` imports any context; and when the app imports from the AI lab (principle V, constitution 1.1.0; ADR-030). Rules without code to check yet MUST still be present and pass on the empty case.- **FR-013**: `constitution:check` MUST verify, on the templates and commands as Spec Kit resolves them, that (a) the spec, plan and tasks templates end with `## Decided without asking`; (b) no command creates `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/`; (c) the plan template's Constitution Check has one item per principle, I to VIII; and (d) no feature directory under `specs/` contains those artifacts (constitution, *Gates* and *Constitution Check*).
- **FR-014**: The term linter MUST check content and translation files for forbidden terms, with whole-word, case-insensitive matching, reporting file, line and term. The term list MUST be one file that cites, for each term, its source in `docs/`, and MUST contain:
  - the terms SP-04 lists explicitly: "piorou", "falhou", "meta não atingida", "você deve", "eu", "percebi", "estou preocupado";
  - the phrases of the "Avoid" column of the [language table](../../docs/product/02-language.md#controlled-language), as written, except those that collide with the "Use" column: "auxilia o seu tratamento", "acompanha os seus sintomas", "exercícios para a sua ansiedade", "isso causa", "isso vai resolver", "percebi que você", "estou preocupado com você", "dias seguidos", "dia improdutivo". "Você tem/apresenta…" stays out, because "Você tem registros suficientes…" is in the "Use" column;
  - an empty group for the diagnosis terms of SP-04, marked as a clinical draft. Its content is decided in `app-shell-and-help`, the first spec with screen text (FR-042).
- **FR-015**: The data-leak checks MUST block files with the extensions and folders already listed in `.gitignore` for databases, exports and secrets (including when added with `--force`), files whose content carries a recognizable database header, and secrets found in file content (principle II; ADR-029).

**Routine protections (US2)**

- **FR-020**: The data-file check, the secret check and the commit-author check (FR-023) MUST run before each commit, and CI MUST run the same data-file and secret checks (ADR-029: "checks at commit time and in CI").
- **FR-021**: Lint MUST fail on any logging call (`console.*` or a logging library) in `apps/mobile` and `packages/domain`, so that no record content can reach a log (principle II, "MUST NOT log record content"; ADR-029). The first spec that needs logs brings a logger with an allow-list of fields and adapts this rule (principle VII).
- **FR-022**: `.gitignore` MUST keep blocking databases and exports (already present), and MUST version only the editor recommendations file from the editor settings folder (FR-040).
- **FR-023**: The commit check MUST refuse a commit whose author email is not a GitHub no-reply address ([09-architecture.md](../../docs/product/09-architecture.md), ADR-029 protections).
- **FR-024**: The repository MUST offer two issue forms, a bug report and a proposal. Every issue form MUST show, before any field, the warning to never paste real content and the crisis resources as written in `README.md` ("If you are in crisis"); blank issues MUST be disabled ([09-architecture.md](../../docs/product/09-architecture.md)).
- **FR-025**: `README.md` MUST stay free of clinical claims and keep the notice that the app is not a medical device (principle IV; [02-language.md](../../docs/product/02-language.md)).
- **FR-026**: No license file MUST be added; the license waits for the legal review (ADR-029; out of scope).

**AI tooling (US6, US7)**

- **FR-030**: `.ia/` MUST be the single source of the project's own agents, commands and skills; `pnpm ai:sync` MUST write the Claude Code and Codex copies from it.
- **FR-031**: `pnpm ai:sync` MUST keep an explicit list of the files Spec Kit generates for each tool and MUST NOT write, change or delete any of them; a source path that collides with the list MUST stop the sync with an error.
- **FR-032**: CI MUST fail when a generated copy differs from what `pnpm ai:sync` would write.
- **FR-033**: Every project agent MUST be read-only (it proposes; it never writes files), MUST never read, request or use real data, MUST turn clinical questions into `[NEEDS CLARIFICATION]` for the owner, MUST never run git operations without the owner's request, and MUST end its artifacts with `## Decided without asking` (constitution, *Who decides what* and *Git operations — never automatic*).
- **FR-034**: The first agents MUST be: `tech-lead` (all principles; picks the specialists and merges their answers — called automatically by the `/review*` commands, and on request by the maintainer or the main agent during `/speckit-*`; the `emovere` preset is not changed), `mobile-architect` (V, VII: pure domain, the layers and bounded contexts of principle V, ubiquitous language and aggregate roots, modules that do not read each other's tables, Expo, local-first, SQLCipher, Keychain/Keystore), `privacy-guardian` (II: logs, backups, crash reports, fixtures, screenshots, `.gitignore`, network canary), `test-writer` (VI: TDD — RED, GREEN, REFACTOR within the Clean Code limits; Vitest, React Native Testing Library, Maestro) and `docs-consistency-auditor` (VIII: `docs/` and code change in the same PR; `## Decided without asking` in every artifact).
- **FR-035**: The first commands MUST be `/review` (code), `/review-spec` (adherence to the spec), `/review-privacy` (real-data leaks in the diff), `/record-decision` (a new ADR or a `Decided without asking` line), `/commit` (groups the changes into atomic commits, presents the plan with every message and file, asks one approval for the whole plan, then creates the commits with the attribution line of the tool that creates them; never pushes) and `/check-gates` (runs the gate scripts, summarizes them, and confirms with `specify preset resolve` and `specify artifact info` that templates and commands come from the `emovere` preset). Commands run in the main agent session: the review commands and `/check-gates` change no file, and `/record-decision` writes only the record of a decision the owner took (it never decides), and `/commit` creates only the commits of the plan the owner approved. `/review-safety` and `/review-language` MUST NOT be created here; they arrive with their agents in `app-shell-and-help`, and the false-insight simulation joins `/check-gates` in `domain-checkin-and-patterns`.
- **FR-036**: Claude Code and Codex hooks MUST call the data-file check before a file write and block database or export files, and MUST call the term linter after a change to a content or translation file. The rule MUST live in the script; the hook MUST only call it.

**Editor and documentation (US8)**

- **FR-040**: `.vscode/extensions.json` MUST recommend exactly: anthropic.claude-code, openai.chatgpt, editorconfig.editorconfig, github.vscode-pull-request-github, github.vscode-github-actions, redhat.vscode-yaml, davidanson.vscode-markdownlint, bierner.markdown-mermaid, streetsidesoftware.code-spell-checker, streetsidesoftware.code-spell-checker-portuguese-brazilian, pomdtr.excalidraw-editor, dbaeumer.vscode-eslint, esbenp.prettier-vscode, expo.vscode-expo-tools, bradlc.vscode-tailwindcss, vitest.explorer and yoavbls.pretty-ts-errors; and list msjsdiag.vscode-react-native as unwanted. It MUST NOT recommend SQLite viewers or other AI assistants (principle II).
- **FR-041**: `docs/` MUST be updated in the same PR to describe the gates, the agents, the commands, the hooks and `pnpm ai:sync`, and to state where each one lives (principle VIII).
- **FR-042**: In the same PR, the "Open" column of `app-shell-and-help` in [docs/roadmap/spec-plan.md](../../docs/roadmap/spec-plan.md) MUST gain the item "SP-04 diagnosis terms for the term linter — **clinical**" (principle VIII; constitution, *Who decides what*: clinical lists go to the owner and the clinical co-author).

### Key Entities

- **Gate**: a check run as a pnpm script, locally and in CI; it passes or fails with a message naming the file and the rule.
- **Project agent / project command**: a definition in `.ia/` with a scope (principles it covers), read-only behaviour and the closing `## Decided without asking` section.
- **Generated-file list**: the explicit list of files Spec Kit owns, per AI tool, that `pnpm ai:sync` never touches.
- **Term list**: the forbidden terms of FR-014 (SP-04 and the language table), each with its source in `docs/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a clean clone, one install command followed by the gate commands reaches green, with every gate of FR-010 passing.
- **SC-002**: For each gate, a synthetic violation makes that gate fail in CI; 100% of the gates are proven this way before the PR merges.
- **SC-003**: 100% of the synthetic data-file and secret samples are refused at commit time and again in CI when the local check is bypassed.
- **SC-004**: The term linter flags 100% of the terms of its list (FR-014) in its fixture set and 0 false positives on the whole-word cases (US4, scenario 2).
- **SC-005**: Changing one agent in `.ia/` and running the sync changes both tools' copies and 0 Spec Kit-generated files.
- **SC-006**: A rule change made only in a check script takes effect in the commit check, CI and both agent hooks with no other file changed.
- **SC-007**: Every agent, command, gate and hook added by this spec is described in `docs/` in the same PR.

## Assumptions

- The Spec Kit setup (step zero, #28) and the constitution 1.1.0 (#31) are on `main`; this branch starts from it.
- The first Maestro E2E flows belong to `app-shell-and-help`, and the network canary test to `builds-and-personas` ([spec-plan](../../docs/roadmap/spec-plan.md)).
- No content or translation file exists yet; the first screen texts arrive with `app-shell-and-help`.
- The crisis resources used in the issue forms are the ones already in `README.md` ("If you are in crisis"), as the owner directed.
- Making the CI gates required for merging and turning on GitHub secret scanning with push protection are repository settings that the owner applies on GitHub ([09-architecture.md](../../docs/product/09-architecture.md)).

## Safety Criteria and References *(mandatory)*

- **SP-04** ([07-clinical-safety.md, Acceptance criteria (SP)](../../docs/product/07-clinical-safety.md#acceptance-criteria-sp)): the term linter (FR-014) runs in CI on content and translation files; it is the mitigation of hazard H-06 ([hazard log](../../docs/safety/hazard-log.md)). Covered by US4 and SC-004.
- No other SP criterion is affected: this spec adds no screen, no data and no user-facing text. The help entry point (SP-13, SP-21) arrives with the first screen, in `app-shell-and-help`.
- **ADR-001** ([adrs.md](../../docs/decisions/adrs.md)): monorepo with a pure-TypeScript domain (FR-001, FR-003).
- **ADR-009**, **ADR-029**: real data never in the repository; routine protections at commit time and in CI (FR-015, FR-020 to FR-024).
- **ADR-010**: Expo/React Native app (FR-002).
- **ADR-030**: no AI-lab code or Python folders in this repository (FR-001, FR-012).
- **ADR-031**, **ADR-032**: Spec Kit with the lean format and *Who decides what*, guarded by `constitution:check` (FR-013) and carried into the project agents (FR-033).

## Clarifications

<!--
  Filled by /speckit-clarify: one "### Session YYYY-MM-DD" per round, one bullet per answer,
  in the form "- Q (<category>): <question> → A: <answer>".
  Leave empty until clarify runs.
-->

### Session 2026-10-12

- Q (Product rule): Which phrases of the "Avoid" column of the language table enter the term linter's list? → A: The SP-04 terms plus the "Avoid" phrases as written, except those that collide with the "Use" column; "Você tem/apresenta…" stays out (FR-014).
- Q (Clinical): Which diagnosis terms does SP-04 forbid, and when must the list exist? → A: The bootstrap linter ships with an empty diagnosis group marked as a clinical draft; the list is decided in `app-shell-and-help`, the first spec with screen text, and is added to its "Open" column in the spec plan in this PR (FR-014, FR-042).
- Q (Standard): How does lint keep record content out of logs, while no record type exists yet? → A: Forbid every logging call in `apps/mobile` and `packages/domain`; the first spec that needs logs brings an allow-list logger and adapts the rule (FR-021).
- Q (Standard): How does `tech-lead` take part in `/speckit-*` and `/review*`? → A: The `/review*` commands call it automatically; during `/speckit-*` it is called on request; the `emovere` preset does not change (FR-034).
- Q (Standard): What do `format:check` and `lint` cover? → A: Code and configuration only; Markdown, `docs/`, `specs/` and the Spec Kit-generated files are excluded (FR-010a).
- Q (Standard): Does one approval of the whole commit plan authorize every commit in it? → A: Yes; the plan lists every commit with its message and files, so approving it approves each operation; anything outside the plan is not authorized, and a commit never authorizes a push (FR-035).
- Q (Standard): Do the commits created by `/commit` carry the `Co-Authored-By: Claude …` attribution line? → A: Yes, every commit (FR-035).
- Q (Standard): Which attribution line does a commit made by Codex through `/commit` carry? → A: Each tool signs with its own name: Claude Code with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, Codex with `Co-Authored-By: Codex <noreply@openai.com>` (FR-035).
- Q (Standard): Where and when is `/commit` created? → A: Now, hand-written for both tools on this branch; this spec moves it to `.ia/skills/commit/`, after which `pnpm ai:sync` writes both copies (FR-035).

## Decided without asking

- Short name `bootstrap`, branch `001-bootstrap` — source: [spec-plan](../../docs/roadmap/spec-plan.md) (spec name) and process (sequential numbering) — reason: the spec plan names the spec; Spec Kit numbers it.
- Branch first based on `chore/speckit-setup`, then moved onto `main` after #28 and #31 were merged (the branch had no commit of its own) — source: process — reason: `main` had no Spec Kit setup when the spec started.
- Spec updated for constitution 1.1.0: FR-010b (Clean Code limits), FR-012 (layers and context boundaries), the `mobile-architect` and `test-writer` scopes in FR-034, and US1 scenarios 5 and 6 — source: constitution 1.1.0 (principles V and VI; Technical Constraints and Stack) — reason: the spec must apply the constitution in force; nothing new was decided.
- `apps/mobile` has no route; the mobile suite proves the runner with a test that renders no screen (FR-002, FR-004) — source: the Input ("no screens") and principle I (help entry point on every screen) — reason: a placeholder screen would be a screen without the help entry point.
- Maestro is configured but runs no flow in CI until `app-shell-and-help` — source: [spec-plan](../../docs/roadmap/spec-plan.md) ("first Maestro E2E tests" in `app-shell-and-help`) — reason: with no screens there is nothing to drive.
- The test-writer agent proposes tests and does not write them — source: the Input ("every agent is read-only") — reason: the owner's rule is explicit.
- Commit-author email check added to the commit check (FR-023) — source: [09-architecture.md](../../docs/product/09-architecture.md) (ADR-029 protections: "commits use GitHub's anonymous no-reply email") — reason: applying a written protection with the commit check the Input already requires.
- Blank issues disabled so every issue goes through a form with the warning (FR-024) — source: [09-architecture.md](../../docs/product/09-architecture.md) (issue templates carry the warning) — reason: otherwise the warning can be skipped.
- Database files also detected by content header, not only by extension (FR-015) — source: principle II and ADR-029 — reason: a renamed file would otherwise pass.
- `constitution:check` also checks the plan template's items I to VIII and the feature directories (FR-013 c, d) — source: constitution, *Constitution Check* and *One artifact per phase* — reason: they are the checkable parts of those rules.
- CI fails on drift between `.ia/` and the generated copies (FR-032) — source: constitution, *One artifact per phase* ("each piece of information lives in one place") — reason: a hand-edited copy would split the source.
- The term linter does not run on `docs/` — source: SP-04, "How to test" ("content and translation files") — reason: `docs/` quotes the forbidden terms as examples.
- Gate rules with no code to check yet (for example, module tables) ship present and passing on the empty case (FR-012) — source: process — reason: later specs then only add code, not gates.
- The owner's answers to the specify questions are recorded under `## Clarifications` — source: constitution, *One artifact per phase* (the questions and answers of a spec live in `Clarifications`) — reason: the specify command of the `emovere` preset does not say where those answers go, and this is the only Q&A section of the spec.
- "Content and translation files" is the single term for the files the term linter and the agent hook check (US4, US7, FR-036) — source: SP-04, "How to test" — reason: the spec also said "screen-text file" for the same thing.
- Secret files listed in `.gitignore` (`.env`, `*.pem`, `*.key`) are blocked at commit even when force-added (FR-015) — source: `.gitignore` "Secrets" section and ADR-029 — reason: `git add --force` bypasses `.gitignore`.
- Two issue forms, bug report and proposal (FR-024) — source: process — reason: the minimum that covers code problems and ideas, each carrying the warning.
- Commands run in the main session; only `/record-decision` writes, and only the record of an owner's decision (FR-035) — source: constitution, *Who decides what* and *Git operations — never automatic*; the Input ("every agent is read-only") — reason: separates the read-only agents from the commands that use them.
- `/commit` adapted from the owner's command in another project to this constitution: it stops on `main`, flags files not changed in the session, blocks database, export and secret files and anything that looks like real data, and runs `leaks:check` and the author check once they exist — source: constitution, *Git operations — never automatic* and principle II; ADR-009, ADR-029 — reason: applying written rules to the owner's command.
- `docs/` placement of the tooling description is left to the plan (FR-041) — source: process — reason: organization of documentation is an agent decision; the plan cites the chosen file.
