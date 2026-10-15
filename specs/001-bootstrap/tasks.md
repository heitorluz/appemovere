---

description: "Task list for the bootstrap feature (Emovere preset)"
---

# Tasks: Bootstrap — repository foundations and gates

**Input**: `specs/001-bootstrap/spec.md` and `specs/001-bootstrap/plan.md`

<!--
  Tasks cite spec and plan IDs instead of copying their text; the only quoted text is a
  constraint from the Model section of plan.md. This spec is exempt from RED as a whole
  (principle VI, FR-006); test tasks still come first in every story, and every fixture is
  synthetic.
-->

## Format: `- [ ] T### [P] [US#] Description in path — refs`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[US#]**: the user story the task belongs to (story phases only)
- **refs**: the spec and plan IDs the task implements

## Phase 1: Setup

- [X] T001 Create the root `package.json` (private; `engines.node` `>=24 <25`; `packageManager` set to the installed pnpm 10.x), `.nvmrc` with `24` and `pnpm-workspace.yaml` listing `apps/*`, `packages/*` and `tooling` — D1, D2, FR-001
- [X] T002 [P] Create `tsconfig.base.json` with `strict: true` and the shared compiler options every package extends — FR-002, FR-003
- [X] T003 [P] Create `.editorconfig` (UTF-8, LF, 2-space indent, final newline) at the repository root — D5

## Phase 2: Foundational

**Blocks every user story.**

- [X] T004 [P] Create `packages/domain/package.json` (no runtime dependencies; scripts `typecheck`, `test`), `packages/domain/tsconfig.json` extending `tsconfig.base.json`, and an empty `packages/domain/src/index.ts` with no entity or rule — FR-003
- [X] T005 [P] Create the private `tooling` package: `tooling/package.json` (scripts `typecheck`, `test`), `tooling/tsconfig.json` with `erasableSyntaxOnly: true` and `tooling/fixtures/` excluded, and `tooling/vitest.config.ts` — D2, D4, plan Contract (Test fixtures)
- [X] T006 Create `apps/mobile` with `create-expo-app` (TypeScript template, current SDK), install Expo Router, delete every route and screen the template creates so that `apps/mobile/app/` has no route, and record the SDK version in `apps/mobile/package.json` — D3, FR-002
- [X] T007 Write the test for the findings formatter in `tooling/tests/findings.test.ts`: each finding prints as `<path>[:<line>] <rule> — <message>` — Contract
- [X] T008 Implement `tooling/lib/findings.ts` (formatter and exit code) and `tooling/lib/git.ts` (list staged files, list tracked files, repository root via `git rev-parse --show-toplevel`) — Contract
- [X] T009 Run `pnpm install` at the root and commit nothing; confirm the lockfile `pnpm-lock.yaml` is created — D1, SC-001

## Phase 3: User Story 1 — Every change passes the gates before it merges (P1)

**Goal**: US1. **Independent test**: a pull request that breaks one gate at a time fails that gate; a clean one passes all (spec US1).

### Tests (write first)

- [X] T010 [P] [US1] Write `tooling/tests/architecture.test.ts` running ESLint with `eslint.architecture.config.js` on synthetic fixtures in `tooling/fixtures/architecture/`, linted through the ESLint API with a virtual path inside `packages/domain/` (plan Contract, Test fixtures): a domain file importing `react`, one importing an Expo module, one importing a SQLite library, one calling `fetch`, one calling `Date.now()`, one calling `Math.random()`, one calling `crypto.randomUUID()`, one importing the AI-lab package scope; a `tracking/domain/` file importing `tracking/application/`, a `tracking/application/` file importing an adapter under `apps/mobile/`, an `insights/` file importing `tracking/domain/`, and a `shared/` file importing `tracking/` — each MUST report an error; a clean domain file and an `insights/` file importing `tracking/application/index.ts` MUST pass — FR-012, D7, principle V
- [X] T011 [P] [US1] Write `tooling/tests/lint-scope.test.ts`: ESLint and Prettier ignore Markdown, `docs/`, `specs/`, `.specify/`, `.claude/skills/speckit-*` and `.agents/skills/speckit-*`, and do check a TypeScript, a JSON and a YAML fixture; with virtual paths in `packages/domain/` and `apps/mobile/`, each limit of Model (Clean Code rules) — "`complexity` with max 10; `max-lines-per-function` with max 50, `skipBlankLines: true`, `skipComments: true`, turned off for test files; `max-lines` with max 300, `skipBlankLines: true`, `skipComments: true`; `max-params` with max 3; `max-depth` with max 3" — fails one value above the limit, and a test file with a 51-line function passes — FR-010a, FR-010b, D18, Model (Clean Code rules)

### Implementation

- [X] T012 [US1] Create `eslint.config.js` (flat config with typescript-eslint) and `.prettierrc.json` plus `.prettierignore`, both scoped as FR-010a: code and configuration only, excluding Markdown, `docs/`, `specs/`, `.specify/`, `.claude/skills/speckit-*`, `.agents/skills/speckit-*` and `tooling/fixtures/`; and, for `packages/domain/**` and `apps/mobile/**`, the rules of Model (Clean Code rules) — D5, D18, FR-010a, FR-010b, plan Contract (Test fixtures)
- [X] T013 [US1] Create `eslint.architecture.config.js` with `no-restricted-imports`, `no-restricted-globals` and `no-restricted-properties` for `packages/domain` (React, Expo, databases, network, real clock, global identifiers), path-scoped `no-restricted-imports` for the layers (`<context>/domain/` cannot import `application/`, `infrastructure/` or `apps/`; `<context>/application/` cannot import `infrastructure/` or `apps/`) and for the context boundaries (another context only through `<context>/application/index.ts`; `shared/` imports no context), and the rule forbidding the AI-lab package scope — D7, FR-012, principle V
- [X] T014 [US1] Add the root scripts `typecheck` (`pnpm -r typecheck`), `lint`, `format:check`, `test` (`pnpm -r test`) and `architecture:check` to `package.json`, and the `typecheck`/`test` scripts of each package — FR-010, Contract
- [X] T015 [US1] Create `.github/workflows/gates.yml` on `pull_request` and on `push` to `main`, `ubuntu-latest`, pnpm cache, with the jobs `types-lint-format`, `tests` and `architecture` — D10, FR-011

**Checkpoint**: typecheck, lint, format, test and architecture gates pass locally and in CI.

## Phase 4: User Story 2 — Real data and secrets are stopped before they leave the machine (P1)

**Goal**: US2. **Independent test**: every synthetic data file and fake secret is refused at commit and again in CI (spec US2).

### Tests (write first)

- [ ] T016 [P] [US2] Write `tooling/tests/data-files.test.ts` with synthetic fixtures generated in a temporary directory at test time and never tracked (plan Contract, Test fixtures), asserting the Model constraints: `blockedExtensions` — "exactly `.db`, `.sqlite`, `.sqlite3`, `.realm`, `.enc`, `.emovere-export`, `.pem`, `.key`, plus names matching `*.db-*` and `*.sqlite-*`"; `blockedNames` — "`.env` and `.env.*`, except `.env.example`"; `blockedFolders` — "`exports/` at any depth"; `blockedHeaders` — "the 16-byte SQLite header `SQLite format 3\0`, checked on the first 16 bytes of every staged or tracked file regardless of extension"; invariants — "The list matches the database, export and secret sections of `.gitignore`; a test fails if they diverge" and "A blocked path is refused even when added with `git add --force`" — FR-015, Model (Data-file rules)
- [ ] T017 [P] [US2] Write `tooling/tests/author.test.ts` asserting the Model constraint: "the author email from `git var GIT_AUTHOR_IDENT` MUST match `^[0-9]+\+[A-Za-z0-9-]+@users\.noreply\.github\.com$` or `^[A-Za-z0-9-]+@users\.noreply\.github\.com$`" (synthetic emails only) — FR-023, Model (Commit-author rule)
- [ ] T018 [P] [US2] Write `tooling/tests/logging-rule.test.ts`: ESLint reports `console.log`, `console.error` and an import of a logging library in fixtures from `tooling/fixtures/logging/`, linted through the ESLint API with virtual paths inside `apps/mobile/` and `packages/domain/`, and nothing in a clean fixture — FR-021, D6, plan Contract (Test fixtures)
- [ ] T019 [P] [US2] Write `tooling/tests/issue-forms.test.ts`: `.github/ISSUE_TEMPLATE/config.yml` has `blank_issues_enabled: false`; `bug-report.yml` and `proposal.yml` are the only forms; each opens with a markdown block containing the "never paste real content" warning and the text of the README section "If you are in crisis", before any field — FR-024

### Implementation

- [ ] T020 [US2] Create `tooling/config/data-files.json` with exactly the values of the Model (Data-file rules) and implement `tooling/checks/data-files.ts` (`--staged` checks staged files, including force-added ones; default checks all tracked files) — FR-015, Contract
- [ ] T021 [US2] Add `secretlint` with its recommended rule preset in `.secretlintrc.json`, and the root script `leaks:check` running `data-files.ts` and `secretlint` (`--staged` for staged files only) — D9, FR-015, Contract
- [ ] T022 [US2] Implement `tooling/checks/author.ts` with the Model regular expressions — FR-023
- [ ] T023 [US2] Add the logging rules to `eslint.config.js`: `no-console: error` and `no-restricted-imports` for logging libraries, in `apps/mobile` and `packages/domain` — D6, FR-021
- [ ] T024 [US2] Install Husky and create `.husky/pre-commit` running `pnpm leaks:check --staged` and `node tooling/checks/author.ts` — FR-020, Contract
- [ ] T025 [P] [US2] Create `.github/ISSUE_TEMPLATE/config.yml`, `bug-report.yml` and `proposal.yml`, each form opening with the warning and the crisis text copied verbatim from `README.md` — FR-024, Contract
- [ ] T026 [US2] Add the `leaks` job (`pnpm leaks:check` over all tracked files) to `.github/workflows/gates.yml` — FR-020, D10

**Checkpoint**: a synthetic `.sqlite` file and a fake token are refused at commit and fail the `leaks` job when the hook is bypassed (SC-003).

## Phase 5: User Story 3 — The monorepo builds and every test suite runs (P2)

**Goal**: US3. **Independent test**: on a clean clone, install and run every gate; a synthetic failing test fails the test gate (spec US3).

### Tests (write first)

- [X] T027 [P] [US3] Write `packages/domain/tests/index.test.ts` (Vitest): the package entry loads and imports nothing outside the package — FR-004
- [X] T028 [P] [US3] Write `apps/mobile/__tests__/runner.test.tsx` (Jest + RNTL): renders a React Native `Text` defined inside the test, with no screen or route — FR-004, FR-002

### Implementation

- [X] T029 [US3] Configure Vitest in `packages/domain/vitest.config.ts` and Jest with the `jest-expo` preset and React Native Testing Library in `apps/mobile/jest.config.js` — D8, FR-004
- [X] T030 [P] [US3] Create `apps/mobile/.maestro/config.yaml`, `apps/mobile/.maestro/flows/.gitkeep` and `apps/mobile/.maestro/README.md` (where flows go, how to install Maestro and run them; first flows in `app-shell-and-help`), and the script `e2e` in `apps/mobile/package.json` — D11, FR-005

**Checkpoint**: `pnpm test` runs the domain, mobile and tooling suites (SC-001).

## Phase 6: User Story 4 — The language gate catches forbidden terms (P2)

**Goal**: US4. **Independent test**: the linter flags each term in its fixtures and nothing inside longer words (spec US4).

### Tests (write first)

- [ ] T031 [US4] Write `tooling/tests/terms.test.ts` with synthetic fixtures under `tooling/fixtures/terms/`, asserting the Model (Term list): `contentGlobs` — "array of glob strings, at least one … MUST NOT match anything under `docs/` or `specs/`"; `groups` — "each group has `id` (one of `"sp-04"`, `"language-table"`, `"sp-04-diagnosis"`), `status` (`"approved"` or `"clinical-draft"`) and `terms` (array, may be empty only when `status` is `"clinical-draft"`)"; each term — "`text` (non-empty string, lower case) and `source` (non-empty string: a `docs/` path with anchor)"; invariants — "Matching is whole-word and case-insensitive, with both sides normalized to NFD and stripped of combining marks before comparison ("voce deve" matches "você deve")", "A word boundary is any position not between two Unicode letters or digits … so "eu" never matches inside "seu" or "meu"", "A finding reports file, line, the matched term and its group" — FR-014, SC-004

### Implementation

- [ ] T032 [US4] Create `tooling/config/forbidden-terms.json` with `contentGlobs` `["apps/mobile/src/locales/**/*.json", "packages/content/**/*.{json,md}"]` and the three groups exactly as the Model lists them: `sp-04` — "exactly "piorou", "falhou", "meta não atingida", "você deve", "eu", "percebi", "estou preocupado"; source `docs/product/07-clinical-safety.md#acceptance-criteria-sp`"; `language-table` — "exactly "auxilia o seu tratamento", "acompanha os seus sintomas", "exercícios para a sua ansiedade", "isso causa", "isso vai resolver", "percebi que você", "estou preocupado com você", "dias seguidos", "dia improdutivo"; source `docs/product/02-language.md#controlled-language`"; `sp-04-diagnosis` — "`status` `"clinical-draft"`, `terms` empty" — FR-014
- [ ] T033 [US4] Implement `tooling/checks/terms.ts` (all `contentGlobs` when no file is given; the given files otherwise) and the root script `terms:check` — FR-014, Contract
- [ ] T034 [US4] Add the `terms` job to `.github/workflows/gates.yml` — FR-011, D10

## Phase 7: User Story 5 — The Spec Kit process is guarded (P2)

**Goal**: US5. **Independent test**: in scratch fixtures, each broken rule makes the check fail and name the rule (spec US5).

### Tests (write first)

- [ ] T035 [US5] Write `tooling/tests/constitution.test.ts` with synthetic fixture trees under `tooling/fixtures/constitution/`: a resolved template without `## Decided without asking` (a); a command mentioning `research.md` without an `## Emovere Overrides` section, and a `speckit-checklist` that is not the disabled stub (b); a plan template missing the row of principle VI (c); a `specs/` folder containing `quickstart.md` (d); and a clean tree that passes — FR-013, Contract

### Implementation

- [ ] T036 [US5] Implement `tooling/checks/constitution.ts` reading the templates through `.specify/scripts/bash/resolve-template.sh <name> --json` and the commands from `.claude/skills/speckit-*/SKILL.md` and `.agents/skills/speckit-*/SKILL.md`, with rules (a) to (d) of the Contract, and the root script `constitution:check` — FR-013, Contract
- [ ] T037 [US5] Add the `constitution` job to `.github/workflows/gates.yml` — FR-011, D10

## Phase 8: User Story 6 — Project agents and commands come from a single source (P3)

**Goal**: US6. **Independent test**: one change in `.ia/` updates both tools' copies and no Spec Kit file; a hand edit fails CI (spec US6).

### Tests (write first)

- [ ] T038 [US6] Write `tooling/tests/ai-sync.test.ts` on a synthetic `.ia/` fixture: a Claude Code agent is written to `.claude/agents/<name>.md` with `tools: Read, Grep, Glob`; a Codex agent to `.codex/agents/<name>.toml` with `sandbox_mode = "read-only"`; each skill to `.claude/skills/<name>/SKILL.md` and `.agents/skills/<name>/SKILL.md`; every generated file starts with the "generated by `pnpm ai:sync`" notice; a target matching `.ia/spec-kit-owned.txt` stops the sync with an error and writes nothing; `--check` fails on drift and on a manifest file not covered by the list; skill frontmatter is copied unchanged (a `disable-model-invocation: true` key survives in the Claude Code copy) and `{{co-author}}` becomes `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` in the Claude Code copy and `Co-Authored-By: Codex <noreply@openai.com>` in the Codex copy; the Model constraints hold — agent `name` "kebab-case, unique, MUST NOT start with `speckit-`", `description` "non-empty, one sentence saying when to use the agent", `principles` "non-empty array of Roman IDs from I to VIII", the body includes the shared block from `.ia/agents/_rules.md`; skill `name` "kebab-case, equal to the folder name, MUST NOT start with `speckit-`" — FR-030, FR-031, FR-032, D12, D13, D14, Model

### Implementation

- [ ] T039 [US6] Create `.ia/spec-kit-owned.txt` with at least `.specify/**`, `.claude/skills/speckit-*/**` and `.agents/skills/speckit-*/**` — FR-031, Model (Spec Kit-owned list)
- [ ] T040 [US6] Create `.ia/agents/_rules.md` with the five rules of FR-033 — FR-033
- [ ] T041 [P] [US6] Create `.ia/agents/tech-lead.md` (all principles; picks the specialists and merges their answers; called by the review skills, and on request during `/speckit-*`) — FR-034, D15
- [ ] T042 [P] [US6] Create `.ia/agents/mobile-architect.md` (V, VII) — FR-034
- [ ] T043 [P] [US6] Create `.ia/agents/privacy-guardian.md` (II) — FR-034
- [ ] T044 [P] [US6] Create `.ia/agents/test-writer.md` (VI; proposes tests, writes none) — FR-034, FR-033
- [ ] T045 [P] [US6] Create `.ia/agents/docs-consistency-auditor.md` (VIII) — FR-034
- [ ] T046 [P] [US6] Create `.ia/skills/review/SKILL.md`, `.ia/skills/review-spec/SKILL.md` and `.ia/skills/review-privacy/SKILL.md`, each delegating to `tech-lead` and changing no file; `review-privacy` reads the diff in the main session and passes it to the agent — FR-035, D15
- [ ] T047 [P] [US6] Create `.ia/skills/record-decision/SKILL.md` (writes only the record of a decision the owner took: a new ADR row in `docs/decisions/adrs.md` or a `Decided without asking` line) — FR-035
- [ ] T048 [P] [US6] Create `.ia/skills/check-gates/SKILL.md` (runs every gate script, summarizes them, and confirms with `specify preset resolve` and `specify artifact info` that the templates and commands come from the `emovere` preset; changes no file) — FR-035
- [ ] T049 [US6] Implement `tooling/ai-sync/sync.ts` and the root script `ai:sync` (with `--check`), then run `pnpm ai:sync` to write the copies listed in the Contract — FR-030, FR-031, D12, D13, Contract
- [ ] T063 [US6] Move `.claude/skills/commit/SKILL.md` to `.ia/skills/commit/SKILL.md` (frontmatter `name` `commit`, `description` non-empty; keep `disable-model-invocation: true`; replace the attribution line with `{{co-author}}`) and let `pnpm ai:sync` write `.claude/skills/commit/SKILL.md` and `.agents/skills/commit/SKILL.md` with the generated notice — FR-035, D19
- [ ] T050 [US6] Add the `ai-sync` job (`pnpm ai:sync --check`) to `.github/workflows/gates.yml` — FR-032, D10

## Phase 9: User Story 7 — Agent hooks enforce the same rules as the scripts (P3)

**Goal**: US7. **Independent test**: each tool's attempt to write a synthetic `.db` is refused with the commit check's message (spec US7).

### Tests (write first)

- [ ] T051 [US7] Write `tooling/tests/hooks.test.ts`: `pre-write.ts` given a Claude Code event whose `tool_input.file_path` is `synthetic.sqlite` exits 2 with the data-file message on stderr; given a Codex `apply_patch` input with `*** Add File: exports/x.json` exits 2; given an allowed path exits 0; `post-write.ts` given a changed path matching `contentGlobs` with "você deve" exits 2 with the term finding, and ignores paths outside `contentGlobs` — FR-036, D16, Contract

### Implementation

- [ ] T052 [US7] Implement `tooling/hooks/pre-write.ts` and `tooling/hooks/post-write.ts`, which only parse the tool input and call `checks/data-files.ts` and `checks/terms.ts` — FR-036, D16
- [ ] T053 [US7] Create `.ia/hooks.json` (PreToolUse and PostToolUse on file-writing tools: Claude Code `Write|Edit|MultiEdit`, Codex `apply_patch|Edit|Write`), extend `tooling/ai-sync/sync.ts` to write the `hooks` key of `.claude/settings.json` and `.codex/hooks.json`, and run `pnpm ai:sync` — FR-036, D12, D13, D16

## Phase 10: User Story 8 — The editor recommends the right extensions (P3)

**Goal**: US8. **Independent test**: VS Code offers exactly the FR-040 list (spec US8, MV1).

### Tests (write first)

- [ ] T054 [US8] Write `tooling/tests/editor.test.ts`: `.vscode/extensions.json` recommends exactly the FR-040 list, lists `msjsdiag.vscode-react-native` as unwanted, and `git check-ignore` ignores any other file in `.vscode/` — FR-040, FR-022

### Implementation

- [ ] T055 [US8] Create `.vscode/extensions.json` with the FR-040 recommendations and unwanted recommendation, and replace the `.vscode/` line of `.gitignore` with `.vscode/*` and `!.vscode/extensions.json` — FR-040, FR-022

## Phase 11: Polish and Cross-Cutting

- [ ] T056 Create `docs/development/tooling.md` describing the gates, the agents, the commands (including `/commit` and the reading that one approval of an enumerated plan approves each commit in it), the hooks, `pnpm ai:sync`, the GitHub settings of MV4, and where each one lives — FR-041, D17
- [ ] T057 Link `docs/development/tooling.md` from `docs/README.md` (Map) and from `docs/product/10-testing-strategy.md` (Process) — FR-041, D17
- [ ] T058 Add "SP-04 diagnosis terms for the term linter — **clinical**" to the Open column of `app-shell-and-help` in `docs/roadmap/spec-plan.md` — FR-042
- [ ] T059 Update the "Constitution draft" labels to name the ratified constitution in `README.md`, `docs/README.md`, `docs/roadmap/spec-plan.md`, `docs/diagrams/use-cases.md`, `docs/product/10-testing-strategy.md` and ADR-032 in `docs/decisions/adrs.md` — plan, Decided without asking; principle VIII
- [ ] T060 Confirm that `README.md` keeps the not-a-medical-device notice with no clinical claim, and that no license file exists — FR-025, FR-026
- [ ] T061 Run every gate locally on a clean clone (`pnpm install`, then `typecheck`, `lint`, `format:check`, `test`, `architecture:check`, `constitution:check`, `terms:check`, `leaks:check`, `ai:sync --check`) — SC-001
- [ ] T062 Run the manual validation MV1–MV6 from plan.md and record the results in `## Review` — MV1–MV6, SC-002

## Dependencies and Execution Order

- Setup (T001–T003) → Foundational (T004–T009) → user stories.
- US1 (T010–T015) creates `eslint.config.js` and `gates.yml`; US2 (T023, T026), US4 (T034), US5 (T037) and US6 (T050) extend them, so they follow US1.
- US3 (T027–T030) can run in parallel with US1 after Foundational.
- US7 depends on US2 (data-file check), US4 (term linter) and US6 (`ai:sync`).
- US8 is independent after Setup.
- Polish (T056–T062) comes last; T061 needs every story.

## Analysis

<!--
  Written by /speckit-analyze: one "### Run YYYY-MM-DD" per run, with the findings table,
  the coverage summary, the metrics and the fixes applied (finding ID → file and section
  fixed at its source).
-->

### Run 2026-10-12

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| I1 | Inconsistency | HIGH | tasks T016; spec US2 (Independent Test); plan Contract | The synthetic database files and fake secrets the tests need would be blocked by `leaks:check` in the pre-commit hook and in CI if they were committed as fixtures. | Plan Contract: gate-blocked fixtures are generated in a temporary directory at test time and never tracked; T016 says so. |
| U1 | Underspecification | HIGH | spec FR-034; tasks T041–T045 | FR-034 gives each agent "the scope given in the Input", but the scopes exist only in the conversation, not in any artifact; T042–T045 cannot be done from the artifacts alone. | Write each agent's scope into FR-034, from the owner's Input of 2026-10-12. |
| I2 | Inconsistency | MEDIUM | tasks T010, T018 | T018 places lint fixtures under `apps/mobile` and `packages/domain`, where the real `lint` and `architecture:check` would fail on them; T010 fixtures sit outside the paths its rules target. | Keep fixtures in `tooling/fixtures/`, lint them through ESLint's API with a virtual file path, and exclude `tooling/fixtures/` from `lint`, `format:check` and `typecheck`. |
| G1 | Coverage | LOW | spec SC-006; tasks T051 | No task proves that a rule change made only in a check's config reaches the hooks. | Add to T051 a case that changes the data-file config in a temporary copy and sees the hook result change. |
| U2 | Underspecification | LOW | plan MV3 | MV3 checks Codex hooks only, while D12 also depends on Codex reading `.codex/agents/` and `.agents/skills/`. | Extend MV3 to confirm Codex lists the five agents and the five skills. |
| I3 | Inconsistency | LOW | spec US1 (Independent Test); tasks phases | US1's independent test breaks gates that US2, US4 and US5 deliver, so it can run in full only after them. | No change to the spec; the full run is T061–T062 (MV6). |

**Coverage summary**

| Requirement | Has task? | Task IDs | Notes |
|---|---|---|---|
| FR-001 | Yes | T001, T004–T006 | |
| FR-002 | Yes | T006, T028 | |
| FR-003 | Yes | T004 | |
| FR-004 | Yes | T027–T029 | |
| FR-005 | Yes | T030 | |
| FR-006 | — | — | Exemption from RED; needs no task |
| FR-010 | Yes | T014, T021, T033, T036 | |
| FR-010a | Yes | T011, T012 | |
| FR-011 | Yes | T015, T026, T034, T037, T050 | Merge blocking also needs MV4 |
| FR-012 | Yes | T010, T013 | |
| FR-013 | Yes | T035, T036 | |
| FR-014 | Yes | T031–T033 | |
| FR-015 | Yes | T016, T020, T021 | |
| FR-020 | Yes | T024, T026 | |
| FR-021 | Yes | T018, T023 | |
| FR-022 | Yes | T054, T055 | |
| FR-023 | Yes | T017, T022, T024 | |
| FR-024 | Yes | T019, T025 | |
| FR-025, FR-026 | Yes | T060 | Review task |
| FR-030 | Yes | T038, T049 | |
| FR-031 | Yes | T038, T039, T049 | |
| FR-032 | Yes | T038, T050 | |
| FR-033 | Yes | T040, T044 | |
| FR-034 | Yes | T041–T045 | See U1 |
| FR-035 | Yes | T046–T048 | |
| FR-036 | Yes | T051–T053 | |
| FR-040 | Yes | T054, T055 | |
| FR-041 | Yes | T056, T057 | |
| FR-042 | Yes | T058 | |
| SC-001 | Yes | T061 | |
| SC-002 | Yes | T062 | MV6 |
| SC-003 | Yes | T016, T026 | |
| SC-004 | Yes | T031 | |
| SC-005 | Yes | T038 | |
| SC-006 | Partial | T051, T052 | See G1 |
| SC-007 | Yes | T056 | |

**Constitution alignment issues**: none. Constitution Check complete (I to VIII, PASS); no removed artifact in the feature folder; no open marker; test tasks precede implementation in every story; the three artifacts end with `## Decided without asking`; SP-04 is covered by FR-014, US4 and T031–T034.

**Unmapped tasks**: none. T003 (`.editorconfig`), T007–T008 (shared helpers) and T059 (constitution labels) map to decisions recorded in `## Decided without asking` of tasks.md and plan.md.

**Metrics**: 37 requirements (30 FR, 7 SC); 62 tasks; coverage 36 of 37 with at least one task (FR-006 needs none), SC-006 partial; ambiguity 2 (U1, U2); duplication 0; critical 0.

**Fixes** (approved by the owner on 2026-10-12 for the HIGH and MEDIUM findings):

- I1 → plan.md, Contract: new "Test fixtures" paragraph (gate-blocked fixtures generated in a temporary directory, never tracked); tasks.md, T016.
- U1 → spec.md, FR-034: the scope of each agent written in, from the owner's Input of 2026-10-12.
- I2 → plan.md, Contract, "Test fixtures" (fixtures in `tooling/fixtures/`, linted through the ESLint API with virtual paths, excluded from `lint`, `format:check` and `typecheck`); tasks.md, T005, T010, T012 and T018.
- G1, U2 and I3 (LOW) left as they are, by the owner's choice.

### Run 2026-10-12 (after constitution 1.1.0)

Re-run after the branch moved onto `main` (constitution 1.1.0) and the spec, plan and tasks were updated (FR-010b, FR-012, FR-034; D7, D18, Constitution Check V and VI; T010–T013).

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| C1 | Constitution alignment | MEDIUM | `.specify/presets/emovere/commands/speckit.implement.md` (item 4 and description) | The implement command still asks for "RED → GREEN" evidence; constitution 1.1.0 (principle VI gate; Definition of Done) asks for RED → GREEN → REFACTOR. Outside this feature's artifacts; `bootstrap` is exempt from RED, so it does not block this feature. | Update the preset command to RED → GREEN → REFACTOR and refresh the preset, in a small PR of its own before the next feature. |
| D1 | Duplication | MEDIUM | tasks T011, T012; plan D18 | T011 and T012 repeat the Clean Code numbers written in D18 (Decisions); tasks may quote only Model constraints, so the numbers can drift if D18 changes. | Move the limits into plan.md `## Model` as the constraints of `eslint.config.js` (as the data-file and term-list rules already are), and keep the quotes in T011 and T012 as Model quotes. |
| G1 | Coverage | LOW | spec SC-006; tasks T051 | Carried over: no task proves that a config-only rule change reaches the hooks. | Unchanged (owner's choice, first run). |
| U2 | Underspecification | LOW | plan MV3 | Carried over: MV3 checks Codex hooks, not that Codex lists the agents and skills. | Unchanged (owner's choice, first run). |
| I3 | Inconsistency | LOW | spec US1 (Independent Test) | Carried over: US1's independent test needs gates from US2, US4 and US5; the full run is T061–T062. | Unchanged (owner's choice, first run). |

**Coverage summary** — as in the first run, plus:

| Requirement | Has task? | Task IDs | Notes |
|---|---|---|---|
| FR-010b | Yes | T011, T012 | New (constitution 1.1.0) |
| FR-012 | Yes | T010, T013 | Extended with layers and context boundaries |
| FR-034 | Yes | T041–T045 | `mobile-architect` and `test-writer` scopes extended |
| US1 scenarios 5 and 6 | Yes | T010, T011 | New |

**Constitution alignment issues**: none in the feature's artifacts. Constitution Check complete with the 1.1.0 items (I to VIII, PASS); no removed artifact; no open marker; test tasks precede implementation in every story; the three artifacts end with `## Decided without asking`; SP-04 covered. C1 sits in the preset, outside the feature.

**Unmapped tasks**: none.

**Metrics**: 38 requirements (31 FR, 7 SC); 62 tasks; coverage 37 of 38 with at least one task (FR-006 needs none), SC-006 partial; ambiguity 1 (U2); duplication 1 (D1); critical 0.

### Run 2026-10-12 (after `/commit`)

Re-run after `/commit` was added (spec FR-035 and Clarifications; plan D17, D19 and Model; tasks T056 and T063).

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U3 | Underspecification | MEDIUM | plan Contract (`ai:sync`), Model (Skill source); tasks T038, T049, T063 | The skill source defines only `name` and `description`; nothing says that `ai:sync` keeps the other frontmatter keys. T063 needs `disable-model-invocation: true` to survive in the Claude Code copy; if the sync drops it, the model could start `/commit` on its own (the command still asks for approval before any commit). | Plan Contract: `ai:sync` copies each skill's frontmatter unchanged to both tools and adds only the notice; T038 asserts that `disable-model-invocation` survives. |
| A1 | Ambiguity | MEDIUM | `.agents/skills/commit/SKILL.md` (step 5); spec Clarifications (attribution answer) | The Codex copy of `/commit` also writes `Co-Authored-By: Claude Opus 5.5 …`, so a commit made by Codex would credit Claude. The owner's answer named the Claude line, without saying what a Codex commit carries. | Question to the owner (Standard). |
| C1 | Constitution alignment | MEDIUM | `.specify/presets/emovere/commands/speckit.implement.md` | Carried over from the previous run: still open, awaiting the owner's choice. | As in the previous run. |
| D1 | Duplication | MEDIUM | tasks T011, T012; plan D18 | Carried over from the previous run: still open, awaiting the owner's choice. | As in the previous run. |
| G1, U2, I3 | — | LOW | — | Carried over from the first run (owner's choice). | Unchanged. |

**Coverage summary** — as in the previous run, plus FR-035 (`/commit`) covered by T056 and T063.

**Constitution alignment issues**: none in the feature's artifacts. `/commit` follows *Git operations — never automatic* (explicit approval of an enumerated plan, no push, no `git add .`, stops on `main`, flags files not changed in the session). C1 sits in the preset.

**Unmapped tasks**: none. T063 maps to FR-035 and D19.

**Metrics**: 38 requirements (31 FR, 7 SC); 63 tasks; coverage 37 of 38 with at least one task (FR-006 needs none), SC-006 partial; ambiguity 2 (U2, A1); duplication 1 (D1); critical 0.

**Fixes** (owner's answers of 2026-10-12: attribution per tool; apply U3 and D1 now, C1 in its own PR):

- A1 → spec.md, Clarifications (new answer) and FR-035; `.agents/skills/commit/SKILL.md` step 5 now signs `Co-Authored-By: Codex <noreply@openai.com>`; plan.md, Model (Skill source: `{{co-author}}` placeholder); tasks.md, T038 and T063.
- U3 → plan.md, Model (Skill source: other frontmatter keys copied unchanged) and Contract (`ai:sync`); tasks.md, T038.
- D1 → plan.md, new Model section "Clean Code rules — `eslint.config.js`", and D18 now cites it; tasks.md, T011 and T012 quote the Model.
- C1 → not applied here; it goes to a separate PR that changes the `emovere` preset.

## Convergence

<!--
  Written by /speckit-converge: one "### Round N — YYYY-MM-DD" per round with the tasks it adds.
  Nothing is written when the code already converges.
-->

## Review

<!--
  Manual review by the owner (constitution, Definition of Done per story).
-->

**Result**: [approved | changes requested]

**Decided without asking — verdict**: [the owner's verdict on the lines of spec.md, plan.md and this file]

## Decided without asking

- Each story adds its own CI job to `gates.yml` instead of one task creating every job — source: process — reason: keeps each story independently testable (US1 to US7).
- The issue forms (FR-024) and the editor recommendations (FR-040) get automated tests in `tooling` — source: process (test infrastructure within existing patterns) — reason: turns two otherwise manual checks into gate-backed tests; MV1 and MV5 still confirm them on VS Code and GitHub.
- A shared findings formatter and git helper (T007, T008) in Foundational — source: plan, Contract (one output format for every check) — reason: every check script and hook uses them.
- `.editorconfig` added in Setup (T003) — source: process — reason: the FR-040 list recommends the EditorConfig extension, which needs the file to do anything.
- T063 placed before T050 in US6 although its ID is the next free one — source: process — reason: `/commit` was added after the task list was numbered; keeping the existing IDs keeps the Analysis references valid.
- T010–T013 extended for constitution 1.1.0 (layers, context boundaries, Clean Code limits) instead of adding new tasks — source: spec FR-010b and FR-012; plan D7 and D18 — reason: the same test and configuration files carry the new rules, and keeping the IDs keeps the Analysis run's references valid.
- FR-025 and FR-026 are confirmed by a review task (T060), not by a script — source: process — reason: both are "keep as is" rules with no code to test.
- `tsconfig.base.json` sets, besides `strict`, ES2022 target and lib, `module` ESNext with `moduleResolution` Bundler, `isolatedModules`, `noEmit` and `skipLibCheck`; `tooling` overrides module resolution for Node (T005) — source: process (shared configuration within the constitution's stack) — reason: `packages/domain` is consumed by the Expo bundler; no flag beyond `strict` was added, so no new development standard is set.
- `.editorconfig` also trims trailing whitespace — source: process (`git diff --check` in `/commit`) — reason: keeps editors aligned with the check that already runs before every commit.
- `.gitignore` gained `dist/`, `build/`, `coverage/`, `*.log` and `*.tsbuildinfo` — source: process (implement step 4, Node.js patterns) — reason: build and test output must not reach the public repository.
- `create-expo-app` ran with `--template blank-typescript --no-install --no-agents-md`; Expo Router came from `expo install`, `main` is `expo-router/entry`, the template's `App.tsx` and `index.ts` were deleted and `apps/mobile/app/.gitkeep` keeps the route folder empty — source: plan D3; spec FR-002 and FR-030 — reason: the blank template brings no routes to undo, and `--no-agents-md` stops the template from writing an `AGENTS.md` and a `.claude/settings.json` outside the single source in `.ia/`.
- The template's MIT `LICENSE` was deleted — source: docs/product/09-architecture.md ("No license file for now") — reason: the repository has no license until legal review.
- `expo-status-bar` was removed from the template's dependencies — source: constitution, principle VII — reason: no screen uses it; `app-shell-and-help` adds it back if its screens need it.
- Package names `@emovere/domain` and `@emovere/tooling`; the app keeps `mobile` — source: plan D11 (`pnpm --filter mobile`) — reason: a bare `domain` would shadow Node's built-in `domain` module.
- TypeScript `~6.0.3` in every package, the version the Expo SDK 57 template pins; `@types/node` `^24` to match Node 24 — source: process (D1, D3) — reason: one compiler across the workspace, and Node types that match the pinned runtime.
- `apps/mobile/tsconfig.json` extends `tsconfig.base.json` first and `expo/tsconfig.base` last — source: process (T002) — reason: Expo's module, JSX and lib settings win while the shared `strict` and `isolatedModules` still apply.
- `packages/domain/src/index.ts` holds only `export {};` — source: process — reason: `isolatedModules` rejects an empty file; it adds no entity or rule (FR-003).
- `tooling/tsconfig.json` uses `NodeNext` resolution with `allowImportingTsExtensions` — source: plan D4 — reason: Node runs the scripts natively, so imports name the `.ts` file.
- `tooling/tests/git.test.ts` added beside T007, against a temporary repository — source: constitution, principle VI — reason: `lib/git.ts` is new code and every check relies on it; the test needs no real repository state.
- `listStagedFiles` leaves out deleted files (`--diff-filter=ACMR`) and every helper takes an optional working folder — source: process (plan Contract) — reason: the checks read the content of staged files, and the tests run in a temporary repository.
- The pnpm peer warnings for `react-native-worklets`, `react-dom` and `@react-native/metro-config` stay unresolved — source: process — reason: they come from optional transitive peers (`@expo/ui`, web); `expo-doctor` passes 21/21 and `expo install --check` reports the dependencies up to date.
- ESLint lints JSON and YAML through `@eslint/json` and `eslint-plugin-yml`; plan D5 and the evidence for principle VII were updated — source: owner, 2026-10-13 (implement US1, Q1: A) — reason: FR-010a puts JSON and YAML in the lint scope.
- The AI-lab rule blocks the reserved scope `@emovere-lab/*` and the folder names `rag`, `revisor`, `evals` and `simulation`, in `apps/mobile` and `packages/domain`; plan D7 was updated — source: owner, 2026-10-13 (implement US1, Q2: A); docs/product/09-architecture.md — reason: `docs/` names no lab package.
- Context boundaries are `no-restricted-imports` regexes on the import path: a named folder before `domain/`, `infrastructure/` or `application/<not index.ts>` means another context; `shared/` may not name any layer folder — source: plan D7 — reason: core rules only; an import that leaves and re-enters its own context by name (`../../tracking/domain/…` inside `tracking`) is flagged, so imports inside a context use short relative paths.
- Besides the imports, globals and properties of T013, the domain also blocks `new Date()` with no arguments, `performance.now`, `crypto.getRandomValues`, Node built-ins and network and identifier libraries — source: spec FR-003 (real clock, network, global identifiers) — reason: the same rule, covering the other common ways in.
- Prettier uses `singleQuote` and `printWidth` 100; `pnpm-lock.yaml` is outside lint and format — source: process — reason: matches the code already written; the lockfile is generated.
- The lint and format tools are root devDependencies, and the root `package.json` declares `"type": "module"` — source: process — reason: the configs live at the root, and Node otherwise warns when it reparses `eslint.config.js` as a module.
- typescript-eslint uses its `recommended` set, without type-aware rules — source: process (D5) — reason: the gate runs without a TypeScript project service; typecheck is its own gate.
- The YAML case of T011 uses an empty mapping value (`yml/no-empty-mapping-value`) — source: process — reason: a duplicate key is a YAML parse error, not a rule finding.
- The `test` script of `apps/mobile` arrives with Jest in T029; T014 added only its `typecheck` — source: process — reason: the runner does not exist before US3. Until T027 and T028 land, `pnpm typecheck` fails in `apps/mobile` (no TypeScript input) and `pnpm test` fails in `packages/domain` (no test files).
- `gates.yml` uses `actions/checkout@v7`, `pnpm/action-setup@v6` and `actions/setup-node@v7` by major tag, `permissions: contents: read`, a per-ref concurrency group, and lists the default `pull_request` types explicitly — source: process (D10) — reason: current majors, least privilege, and the YAML lint forbids an empty mapping value.
- `tooling/tests/support/eslint.ts` holds the helper that lints text at a virtual path, shared by both US1 tests — source: process (REFACTOR) — reason: removes the duplicated helper.
- `apps/mobile/app.json` and `tooling/tests/findings.test.ts` were reformatted by Prettier — source: process — reason: the new `format:check` gate covers them.
- The mobile suite uses Jest 29 (the version `jest-expo` 57 runs on), `@types/jest` 29, React Native Testing Library 14 and its peer `test-renderer`; `apps/mobile/jest.config.js` stays CommonJS because the app package has no `"type"` — source: plan D8 — reason: the versions the SDK 57 preset supports.
- TypeScript 6 includes no `@types` package by default, so `apps/mobile/tsconfig.json` declares `types: ["jest"]` — source: process — reason: the test globals need their types.
- `packages/domain` typechecks `src/` with no ambient types and the tests with `tests/tsconfig.json`, which adds Node types; its `typecheck` script runs both, and `@types/node` is a dev dependency used by the tests only — source: spec FR-003 — reason: domain code never sees Node globals, while the test that inspects the source can read files.
- `packages/domain/tsconfig.json` sets `allowImportingTsExtensions` — source: plan D7 (`application/index.ts`) — reason: imports name the `.ts` file, as the context-boundary rule expects.
- The domain purity rules of `architecture:check` apply to `packages/domain/src/**`; layer and context rules were already scoped to `src/` — source: spec FR-003 (the domain's code) and principle V — reason: the T027 test uses Node to read the source it checks; the rules still bind every domain file.
- The T027 test checks "imports nothing outside the package" by reading the import specifiers of every `src/` file — source: process — reason: it fails on any bare or escaping import, proved with a temporary `react` import; it passed on its first run because the entry already existed (bootstrap exempt from RED).
- `pnpm --filter mobile e2e` runs `maestro test .maestro`, which reads `config.yaml`; Maestro is a system tool documented in `.maestro/README.md`, not an npm dependency — source: plan D11 — reason: the official install is a standalone CLI.
