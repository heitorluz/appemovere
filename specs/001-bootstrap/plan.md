# Implementation Plan: Bootstrap — repository foundations and gates

**Branch**: `001-bootstrap` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-bootstrap/spec.md`

## Summary

A pnpm workspace with `apps/mobile` (Expo, no route), `packages/domain` (pure TypeScript) and a private `tooling` package that holds every check script and its tests (US3). `architecture:check` enforces the layers and bounded-context boundaries of constitution 1.1.0 and `lint` its Clean Code limits (FR-010b, FR-012). The gates are pnpm scripts that call those scripts, run by one GitHub Actions workflow on every pull request and, for the data-leak and author checks, by a Husky pre-commit hook (US1, US2, US5; FR-010 to FR-026). `.ia/` is the single source for the project's agents, skills and agent hooks; `pnpm ai:sync` writes the Claude Code and Codex copies and refuses to touch Spec Kit's files (US6, US7; FR-030 to FR-036). Editor recommendations and the `docs/` updates close the feature (US8; FR-040 to FR-042). The stack is the constitution's (Technical Constraints and Stack); this plan records only what the feature chooses.

## Decisions

| ID | Decision | Chosen | Discarded | Reason |
|----|----------|--------|-----------|--------|
| D1 | Runtime and package manager pins | Node 24 LTS (`engines.node` `>=24 <25`, `.nvmrc`); pnpm pinned in `packageManager` (the 10.x version installed at implement time), via Corepack | Node 22 LTS; unpinned pnpm | Node 24 is the current LTS and runs TypeScript files natively (D4); pins make local runs and CI identical (SC-001). |
| D2 | Workspace layout | `pnpm-workspace.yaml` with `apps/*`, `packages/*` and `tooling`; root `package.json` holds the gate scripts | Gate scripts in the root only; a `scripts/` folder outside the workspace | A workspace package gives the check scripts their own Vitest suite (SC-002 to SC-004) without adding a new tool. FR-001 forbids only `apps/api`, `packages/content` and Python folders. |
| D3 | `apps/mobile` creation | `create-expo-app` with the TypeScript template at the current SDK, Expo Router installed, the `app/` folder left without routes; the exact SDK is recorded in `apps/mobile/package.json` at implement time | Pinning an SDK number in this plan; a placeholder route | "Current SDK" (constitution) is a fact of the day of implementation; no route per FR-002. |
| D4 | Language of the check scripts | TypeScript run directly by Node 24 (type stripping), with `erasableSyntaxOnly` on | `tsx` or `ts-node`; plain `.mjs` | No extra dependency (VII); hooks start fast; the scripts share types with their tests. |
| D5 | Lint and format | ESLint (flat config, typescript-eslint) and Prettier, scoped by FR-010a; ignore files list the Spec Kit-generated paths | Biome | ESLint and Prettier are the constitution's tools. |
| D6 | Logging rule (FR-021) | ESLint `no-console: error` and `no-restricted-imports` for logging libraries in `apps/mobile` and `packages/domain` | An allow-list logger now; a type-aware rule | Owner, 2026-10-12 (spec Clarifications). |
| D7 | `architecture:check` (FR-012) | A separate ESLint config (`eslint.architecture.config.js`) run by `architecture:check`: `no-restricted-imports` and `no-restricted-globals`/`no-restricted-properties` in `packages/domain`; path-scoped `no-restricted-imports` for the layers (`<context>/domain/` cannot import `application/`, `infrastructure/` or `apps/`; `<context>/application/` cannot import `infrastructure/` or `apps/`), for the context boundaries (a context imports another only through `<context>/application/index.ts`, never its `domain/`; `shared/` imports no context), present for future `packages/domain/src/<context>/` folders; a rule forbidding imports of the AI-lab package scope | dependency-cruiser; eslint-plugin-boundaries | No new dependency (VII); the rules are those of principle V and ADR-030 and can be tested with fixtures. |
| D8 | Mobile test runner (FR-004) | Jest with the `jest-expo` preset, running React Native Testing Library | Vitest for React Native | RNTL (constitution) runs on Jest in Expo; Vitest stays the domain runner. |
| D9 | Secret scanning (FR-015, FR-020) | `secretlint` (npm) with its recommended rule preset, on staged files before commit and on all tracked files in CI; plus GitHub secret scanning with push protection (repository setting, MV4) | gitleaks or trufflehog (system binaries) | Runs the same way locally, in CI and in hooks with no system install; GitHub push protection covers what reaches the remote ([09-architecture.md](../../docs/product/09-architecture.md)). |
| D10 | CI | One workflow `.github/workflows/gates.yml`, on `pull_request` and on `push` to `main`, `ubuntu-latest`, one job per gate group so each failure is named (US1) | One job with every gate; iOS/macOS runners | Every gate runs on every PR (FR-011); no device or simulator is needed until Maestro flows exist. |
| D11 | Maestro (FR-005) | `apps/mobile/.maestro/` with `config.yaml`, an empty `flows/` folder and a `README.md`; `pnpm --filter mobile e2e` runs it locally; no CI job until `app-shell-and-help` | A CI job with no flows | Spec, Decided without asking (Maestro). |
| D12 | Codex targets of `ai:sync` (FR-030) | Agents → `.codex/agents/<name>.toml` with `sandbox_mode = "read-only"`; commands → skills in `.agents/skills/<name>/SKILL.md`; hooks → `.codex/hooks.json` | Everything under `.codex/` | The Input says ".codex/ copies"; Codex reads project skills only from `.agents/skills/` (where Spec Kit also writes its Codex skills) and agents and hooks from `.codex/` (OpenAI Codex docs: [Hooks](https://learn.chatgpt.com/docs/hooks), [Skills](https://learn.chatgpt.com/docs/build-skills), [Subagents](https://developers.openai.com/codex/subagents)). |
| D13 | Claude Code targets of `ai:sync` | Agents → `.claude/agents/<name>.md` with `tools: Read, Grep, Glob`; commands → skills in `.claude/skills/<name>/SKILL.md`; hooks → the `hooks` key of `.claude/settings.json` | Commands in `.claude/commands/` | Skills are the format Spec Kit already uses for Claude Code, and the same `SKILL.md` serves both tools. Restricting tools to Read, Grep and Glob makes the agents read-only (FR-033). |
| D14 | Sources in `.ia/` | `.ia/agents/<name>.md` (frontmatter + instructions), `.ia/skills/<name>/SKILL.md`, `.ia/hooks.json`, `.ia/spec-kit-owned.txt` | One source format per tool | One source per item (FR-030); the per-tool differences live in `ai:sync`, not in the sources. |
| D15 | `tech-lead` participation | The five commands of FR-035 that review (`/review`, `/review-spec`, `/review-privacy`) delegate to `tech-lead`, which picks the specialists; `/speckit-*` unchanged | Changing the `emovere` preset | Owner, 2026-10-12 (spec Clarifications). |
| D16 | Agent hooks (FR-036) | `PreToolUse` on file-writing tools (Claude Code: `Write\|Edit\|MultiEdit`; Codex: `apply_patch\|Edit\|Write`) → `tooling/hooks/pre-write.ts`; `PostToolUse` on the same tools → `tooling/hooks/post-write.ts`. Both only parse the tool input and call the check modules | A hook on shell commands | The rules stay in the check modules (FR-036). Shell commands that create files cannot be parsed reliably; the commit check and CI remain the backstop (spec, Edge Cases). |
| D17 | Documentation placement (FR-041) | New `docs/development/tooling.md` (gates, agents, commands, hooks, `ai:sync`, GitHub settings, and the reading that one approval of an enumerated commit plan approves each commit in it), linked from `docs/README.md` and from [10-testing-strategy.md](../../docs/product/10-testing-strategy.md) | Spreading the description over the product documents | `docs/product/` describes the product; one place for the tooling avoids copies. |
| D18 | Clean Code limits (FR-010b) | Core ESLint rules in `eslint.config.js`, with the values in Model (Clean Code rules) | A plugin such as eslint-plugin-sonarjs | The constitution's numbers (Technical Constraints and Stack) map one to one onto core ESLint rules; no new dependency (VII). |
| D19 | `/commit` (FR-035) | Hand-written now in `.claude/skills/commit/SKILL.md` and `.agents/skills/commit/SKILL.md` with `disable-model-invocation: true`; T063 moves it to `.ia/skills/commit/SKILL.md`, and `ai:sync` writes both copies from then on | Waiting for `ai:sync` before having a commit command | Owner, 2026-10-12 (spec Clarifications); the command is needed for this branch's own commits. |

## Model

No domain model change: `packages/domain` stays empty (FR-003). The feature introduces five configuration files whose constraints the scripts enforce.

### Term list — `tooling/config/forbidden-terms.json`

- **Change**: new
- **Fields and constraints**:
  - `contentGlobs` — array of glob strings, at least one; the content and translation files the linter reads. Initial value: `["apps/mobile/src/locales/**/*.json", "packages/content/**/*.{json,md}"]`. MUST NOT match anything under `docs/` or `specs/`.
  - `groups` — array; each group has `id` (one of `"sp-04"`, `"language-table"`, `"sp-04-diagnosis"`), `status` (`"approved"` or `"clinical-draft"`) and `terms` (array, may be empty only when `status` is `"clinical-draft"`).
  - each term has `text` (non-empty string, lower case) and `source` (non-empty string: a `docs/` path with anchor).
  - group `sp-04`: exactly "piorou", "falhou", "meta não atingida", "você deve", "eu", "percebi", "estou preocupado"; source `docs/product/07-clinical-safety.md#acceptance-criteria-sp`.
  - group `language-table`: exactly "auxilia o seu tratamento", "acompanha os seus sintomas", "exercícios para a sua ansiedade", "isso causa", "isso vai resolver", "percebi que você", "estou preocupado com você", "dias seguidos", "dia improdutivo"; source `docs/product/02-language.md#controlled-language`.
  - group `sp-04-diagnosis`: `status` `"clinical-draft"`, `terms` empty (spec FR-014, FR-042).
- **Invariants**:
  - Matching is whole-word and case-insensitive, with both sides normalized to NFD and stripped of combining marks before comparison ("voce deve" matches "você deve").
  - A word boundary is any position not between two Unicode letters or digits (`(?<![\p{L}\p{N}])` … `(?![\p{L}\p{N}])`), so "eu" never matches inside "seu" or "meu".
  - A finding reports file, line, the matched term and its group.

### Data-file rules — `tooling/config/data-files.json`

- **Change**: new
- **Fields and constraints**:
  - `blockedExtensions` — exactly `.db`, `.sqlite`, `.sqlite3`, `.realm`, `.enc`, `.emovere-export`, `.pem`, `.key`, plus names matching `*.db-*` and `*.sqlite-*`.
  - `blockedNames` — `.env` and `.env.*`, except `.env.example`.
  - `blockedFolders` — `exports/` at any depth.
  - `blockedHeaders` — the 16-byte SQLite header `SQLite format 3\0`, checked on the first 16 bytes of every staged or tracked file regardless of extension.
- **Invariants**:
  - The list matches the database, export and secret sections of `.gitignore`; a test fails if they diverge.
  - A blocked path is refused even when added with `git add --force`.

### Clean Code rules — `eslint.config.js`

- **Change**: new
- **Fields and constraints**: for files under `packages/domain/**` and `apps/mobile/**`: `complexity` with max 10; `max-lines-per-function` with max 50, `skipBlankLines: true`, `skipComments: true`, turned off for test files; `max-lines` with max 300, `skipBlankLines: true`, `skipComments: true`; `max-params` with max 3; `max-depth` with max 3.
- **Invariants**: the numbers are the constitution's (Technical Constraints and Stack); a constitution amendment that changes them changes this rule set in the same PR.

### Commit-author rule (inside `tooling/checks/author.ts`)

- **Change**: new
- **Fields and constraints**: the author email from `git var GIT_AUTHOR_IDENT` MUST match `^[0-9]+\+[A-Za-z0-9-]+@users\.noreply\.github\.com$` or `^[A-Za-z0-9-]+@users\.noreply\.github\.com$`.

### Agent source — `.ia/agents/<name>.md`

- **Change**: new
- **Fields and constraints**:
  - frontmatter `name` — kebab-case, unique, MUST NOT start with `speckit-`.
  - frontmatter `description` — non-empty, one sentence saying when to use the agent.
  - frontmatter `principles` — non-empty array of Roman IDs from I to VIII.
  - body — the instructions. MUST include the five rules of FR-033, read-only, no real data, clinical questions become `[NEEDS CLARIFICATION]`, no git without the owner's request, artifacts end with `## Decided without asking`, as a shared block that `ai:sync` inserts from `.ia/agents/_rules.md`.
- **Invariants**: the five agents of FR-034 exist; no other agent is created by this feature.

### Skill source — `.ia/skills/<name>/SKILL.md`

- **Change**: new
- **Fields and constraints**: frontmatter `name` (kebab-case, equal to the folder name, MUST NOT start with `speckit-`) and `description` (non-empty). Exactly the six skills of FR-035: `review`, `review-spec`, `review-privacy`, `record-decision`, `commit`, `check-gates`. Other frontmatter keys (for example `disable-model-invocation`) are allowed and copied unchanged. The body may contain the placeholder `{{co-author}}`, which `ai:sync` replaces with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` in the Claude Code copy and `Co-Authored-By: Codex <noreply@openai.com>` in the Codex copy.

### Spec Kit-owned list — `.ia/spec-kit-owned.txt`

- **Change**: new
- **Fields and constraints**: one repository-relative path or glob per line; MUST include `.specify/**`, `.claude/skills/speckit-*/**` and `.agents/skills/speckit-*/**`.
- **Invariants**: `ai:sync --check` fails if a file listed in `.specify/integrations/*.manifest.json` is not covered by this list, so the list stays explicit and current.

## Contract

**pnpm scripts (root)** — each exits 0 on success and non-zero on failure, printing one line per finding as `<path>[:<line>] <rule> — <message>`:

| Script | Runs |
|---|---|
| `typecheck` | `tsc --noEmit` in every package (`pnpm -r typecheck`) |
| `lint` | ESLint over code and configuration (FR-010a, D6) |
| `format:check` | `prettier --check` over code and configuration (FR-010a) |
| `test` | `pnpm -r test`: Vitest in `packages/domain` and `tooling`, Jest in `apps/mobile` |
| `architecture:check` | ESLint with `eslint.architecture.config.js` (D7) |
| `constitution:check` | `node tooling/checks/constitution.ts` |
| `terms:check` | `node tooling/checks/terms.ts [files…]` (term linter; all `contentGlobs` when no file is given) |
| `leaks:check` | `node tooling/checks/data-files.ts` and `secretlint` over all tracked files (`--staged` for staged files only) |
| `ai:sync` | `node tooling/ai-sync/sync.ts` (`--check`: write nothing, fail on drift) |

**`constitution:check`** (FR-013) reads what Spec Kit resolves: the templates through `.specify/scripts/bash/resolve-template.sh <name> --json`, and the commands as materialized in `.claude/skills/speckit-*/SKILL.md` and `.agents/skills/speckit-*/SKILL.md`. It fails when:
- (a) the resolved spec, plan or tasks template does not end with `## Decided without asking`;
- (b) a command mentions `research.md`, `data-model.md`, `contracts/`, `quickstart.md` or `checklists/` without an `## Emovere Overrides` section that forbids it, or `speckit-checklist` is not the disabled stub. This checks that the override is present; what an agent does with the text is checked in review;
- (c) the resolved plan template's Constitution Check lacks a row for any principle from I to VIII;
- (d) any folder under `specs/` contains one of the removed artifacts.

**Test fixtures** — fixtures live in `tooling/fixtures/`, which `lint`, `format:check` and `typecheck` exclude. Fixtures that a gate would block (database files, export files, files with a database header, fake secrets) are never tracked: each test writes them to a temporary directory and deletes them afterwards. Lint and architecture fixtures are read as text and linted through the ESLint API with a virtual file path inside `apps/mobile/` or `packages/domain/`, so the path-scoped rules apply without placing files in those packages.

**Pre-commit (`.husky/pre-commit`)** runs `leaks:check --staged` and `node tooling/checks/author.ts`; FR-020.

**Agent hooks** — `tooling/hooks/pre-write.ts` reads the tool event as JSON on stdin, extracts the target paths (`tool_input.file_path` for Claude Code; the `*** Add File:` / `*** Update File:` lines of an `apply_patch` input for Codex), calls the data-file check, and on a block exits 2 with the check's message on stderr. `tooling/hooks/post-write.ts` calls `terms.ts` on changed paths that match `contentGlobs` and exits 2 with the findings on stderr so the agent sees them. Paths are resolved from `git rev-parse --show-toplevel`.

**`ai:sync`** writes, from `.ia/`: `.claude/agents/*.md`, `.claude/skills/<name>/SKILL.md`, the `hooks` key of `.claude/settings.json`, `.codex/agents/*.toml`, `.agents/skills/<name>/SKILL.md` and `.codex/hooks.json`. Every generated file starts with a "generated by `pnpm ai:sync` from `.ia/…`; do not edit" notice. Skill frontmatter is copied unchanged, and `{{co-author}}` is replaced with each tool's attribution line (Model, Skill source). It stops with an error, writing nothing, when a target matches `.ia/spec-kit-owned.txt`.

**CI** (`.github/workflows/gates.yml`) — jobs `types-lint-format`, `tests`, `architecture`, `constitution`, `terms`, `leaks`, `ai-sync` (runs `ai:sync --check`).

**GitHub issue forms** — `.github/ISSUE_TEMPLATE/bug-report.yml`, `proposal.yml` and `config.yml` (`blank_issues_enabled: false`); each form opens with a markdown block holding the warning and the crisis text copied from `README.md`.

## Manual validation

- [ ] **MV1** VS Code recommendations — open a fresh clone in VS Code — the prompt lists exactly the FR-040 extensions and marks `msjsdiag.vscode-react-native` as unwanted.
- [ ] **MV2** Claude Code hook — in a Claude Code session, ask to create `synthetic.sqlite` and to edit a synthetic locale file containing "você deve" — the write is blocked with the data-file message; the edit returns the term finding.
- [ ] **MV3** Codex hook — trust the project `.codex/` layer and its hooks with `/hooks`, then repeat MV2 in Codex — same results.
- [ ] **MV4** GitHub settings (owner) — branch protection on `main` requiring every job of `gates.yml`; secret scanning with push protection on; account email kept private, so web merges use the no-reply address — the settings page shows each one enabled.
- [ ] **MV5** Issue forms — open "New issue" on GitHub — only the two forms appear, each showing the warning and the crisis text before any field.
- [ ] **MV6** Gate failures in CI (SC-002) — one draft PR with a synthetic violation per gate — each job fails with its finding; then close the PR without merging.

## Constitution Check

| # | Principle | Item | Result | Evidence |
|---|-----------|------|--------|----------|
| I | Psychological Safety Before Engagement | spec.md lists every SP criterion the feature affects as acceptance criteria. Nothing adds streaks, points, achievements or signals of a skipped check-in; nothing shows an insight right after a check-in; nothing infers, predicts, ranks or scores the person; no open chat. The help entry point stays visible and working on every screen, offline and before unlock. | PASS | spec, Safety Criteria (SP-04); no screen (FR-002), so no screen lacks the help entry point. |
| II | Real Data Never Leaves the Phone | User data stays only in the encrypted on-device database. Tests, fixtures, examples and screenshots use synthetic persona data only. No record content in logs. No network destination outside the allow-list; no analytics or advertising SDK. | PASS | No user data; fixtures synthetic (Model, check tests); D6 bans logging; D9, data-file rules and D16 block data files at write, commit and CI. |
| III | The Code Calculates, AI Only Writes | Every pattern or number shown comes from deterministic domain code with the parameterized rule and `NO_INSIGHT`. The pair, insight and 56-day limits hold; forbidden factors and personal tags stay out of the engine. No AI in Phase 1. | PASS | No pattern, number or AI in the app; the agents are development tools outside the app (FR-030). |
| IV | Language That Complements, Never Treats | User-facing text follows the language table in docs/: no diagnosis, judgement, obligation or AI in the first person. Clinical content stays marked as draft until the clinical co-author approves it. | PASS | Term list (Model) enforces SP-04 and the language table; the diagnosis group ships as `clinical-draft`; the issue forms reuse the README crisis text verbatim, adding no new clinical text. |
| V | Clean Architecture and Domain-Driven Design — Dependency Rule Points Inward | `packages/domain` stays pure TypeScript. Dependencies point inward only (adapters → application → domain): entities, value objects and rules in `<context>/domain/`, use cases and ports in `<context>/application/`, adapters in `apps/mobile/src/<context>/infrastructure/`, one composition root. A bounded context uses another only through its application API and never reads its tables; `shared/` holds only generic value objects. Names follow the domain model in `docs/`; aggregates change only through their root. Nothing imports from the AI lab. | PASS | D7 enforces purity, layers and context boundaries in `architecture:check` (FR-012); no context, entity or aggregate exists yet (FR-003), so language and roots have nothing to review. |
| VI | Test-Driven Development (TDD): Red-Green-Refactor | Every change of behaviour follows RED → GREEN → REFACTOR, and refactored code stays within the Clean Code limits (Technical Constraints and Stack). Each story's test tasks precede its implementation tasks. Every invariant in Model has a domain unit test; every adapter has an integration test against the real encrypted database; affected critical journeys have Maestro E2E; new screens are checked with VoiceOver, TalkBack and large fonts. (`bootstrap` is exempt from RED and leaves the runners and suites installed.) | PASS | Exempt from RED (FR-006); runners wired (FR-004, D8, D11); each Model invariant gets a `tooling` test written before its script; the Clean Code limits are enforced by lint (FR-010b, D18). |
| VII | Minimal Effective Interaction, Local-First | Nothing is designed to maximize sessions, notifications or minutes of use. No own server. Every new dependency, layer or abstraction answers a need stated in spec.md. | PASS | Dependencies tied to FRs: Expo/Expo Router (FR-002), Vitest (FR-004), Jest + jest-expo + RNTL (FR-004, D8), ESLint/typescript-eslint/Prettier (FR-010), Husky (FR-020), secretlint (FR-015, D9). D4 and D7 avoid extra tools. |
| VIII | Documentation and Code in Agreement | spec.md and plan.md cite SP and ADR IDs. The docs/ changes this feature requires are listed and land in the same PR. A sensitive feature meets the sensitive-feature Definition of Done before anyone other than the maintainer uses it. | PASS | D17 and FR-041/FR-042 list the docs/ changes; not a sensitive feature. |

## Decided without asking

- D1 Node 24 LTS and the pnpm pin — source: process — reason: version pins within the constitution's stack; Node 24 is the installed LTS.
- D2 a private `tooling` workspace package — source: process (test infrastructure within existing patterns) — reason: the check scripts need their own tests; FR-001 does not forbid it.
- D3 SDK recorded at implement time — source: constitution, Technical Constraints and Stack ("current SDK") — reason: the current SDK is a fact of the implementation day.
- D4 TypeScript run natively by Node — source: process — reason: avoids a runner dependency (VII).
- D5 ESLint and Prettier — source: constitution, Technical Constraints and Stack.
- D7 `architecture:check` built on ESLint — source: principle V, ADR-030 and VII — reason: no new tool for rules ESLint already expresses.
- D8 Jest with `jest-expo` for the mobile suite — source: constitution, Technical Constraints and Stack (React Native Testing Library) — reason: RNTL's runner in Expo; Vitest stays for the domain.
- D9 `secretlint` plus GitHub push protection — source: [09-architecture.md](../../docs/product/09-architecture.md) (secret scanning with push protection) and FR-020 — reason: same tool locally, in CI and in hooks, with no system binary. The owner may veto in review.
- D10 CI on pull requests and on pushes to `main`, one job per gate group — source: constitution, *Gates*; FR-011 — reason: each failure is named, and `main` stays verified.
- D12 and D13 per-tool targets of `ai:sync`, including `.agents/skills/` for Codex commands — source: the OpenAI Codex and Claude Code documentation cited in D12 and D13 — reason: each tool reads only its own locations; the Input's ".codex/ copies" holds for agents and hooks.
- D14 `.ia/` layout — source: process — reason: one source per item (FR-030).
- D16 hooks only on file-writing tools — source: FR-036 — reason: shell commands cannot be parsed reliably; the commit check and CI cover them.
- D18 Clean Code limits as core ESLint rules — source: constitution 1.1.0, Technical Constraints and Stack (the numbers) and VII — reason: one rule per limit, no new dependency.
- D7 extended and Constitution Check items V and VI rewritten for constitution 1.1.0 (layers and context boundaries; TDD with the Clean Code limits) — source: constitution 1.1.0, principles V and VI; the `emovere` preset 1.1.0 plan template — reason: the plan must check the constitution in force.
- Clean Code values moved from D18 to Model (Clean Code rules); `ai:sync` keeps skill frontmatter unchanged and fills `{{co-author}}` per tool — source: Analysis run after `/commit` (D1, U3) and the owner's answer on attribution (spec Clarifications) — reason: tasks quote Model constraints only, and `/commit` must keep `disable-model-invocation` and sign with the right tool.
- D17 `docs/development/tooling.md` — source: process (where to record each thing) — reason: one place for the tooling description (FR-041).
- The `docs/` labels "Constitution draft" in `README.md`, `docs/README.md`, `docs/roadmap/spec-plan.md`, `docs/diagrams/use-cases.md`, `docs/product/10-testing-strategy.md` and ADR-032 are updated to name the ratified constitution in this PR — source: principle VIII — reason: since the ratification, those labels describe a file that is only a pointer.
- Fixed in spec.md: the Key Entity "Term list" said "the forbidden terms of SP-04"; it now says "the forbidden terms of FR-014 (SP-04 and the language table)" — source: spec Clarifications (Q1 of specify) — reason: the entity contradicted FR-014 after the owner's answer.
- `constitution:check` (b) verifies that the override is present, not agent behaviour — source: process — reason: a script cannot judge what an agent will do with a prompt; review covers that.
