---
name: commit
description: Group worktree changes into atomic commits, present the plan, request one explicit approval, then create every approved commit safely. Never pushes. Use when the owner asks to commit.
argument-hint: "Optional instructions about grouping, ordering, scope, exclusions or messages"
compatibility: Requires a Git repository
metadata:
  author: emovere
  source: project command (moves to .ia/skills/commit/ with the bootstrap spec)
user-invocable: true
disable-model-invocation: true
---

# Commit

## User Input

```text
$ARGUMENTS
```

Treat the arguments as optional instructions about grouping, ordering, scope, exclusions or commit
messages. Keep an exact message the owner gives unless it misdescribes its diff; then say why.

## Goal

Analyze the eligible worktree changes, divide them into atomic commits, present the complete plan,
request one explicit approval, and then create every approved commit in order. Never push.

This command applies the constitution (`.specify/memory/constitution.md`): *Git operations — never
automatic* and principle II (*Real Data Never Leaves the Phone*). Approving a plan that lists every
commit, with its message and files, approves each of those operations; nothing outside the plan is
authorized, and a commit never authorizes a push.

## Phase 1 — Read-only proposal

Do not change the index, the worktree, commits, refs or remote state in this phase.

1. **Inspect the repository**
   - Confirm this is a Git worktree and record the current branch.
   - If the branch is the default branch (`main`), stop: the constitution forbids committing
     directly to it. Suggest a branch name and wait.
   - Run `git status --short` and inspect every staged, unstaged and untracked change within any
     scope the owner gave.
   - Read recent commit subjects to follow the repository's convention.
   - Never discard, overwrite or rewrite existing changes.

2. **Protect real data and secrets (principle II, ADR-009, ADR-029)**
   - Never propose for staging: database files (`.db`, `.sqlite`, `.sqlite3`, `.realm`, `*-wal`,
     `*-shm`, `*.db-*`, `*.sqlite-*`), encrypted or export files (`.enc`, `.emovere-export`,
     anything under `exports/`), `.env` files other than `.env.example`, keys and certificates
     (`.pem`, `.key`), or unexpectedly large binaries.
   - Read every candidate diff. Stop and warn the owner when a change may contain credentials,
     tokens, private keys, personal data, or anything that looks like a real journal entry,
     check-in, note or screenshot of real use. Fixtures, examples and tests use synthetic data only.
   - Respect `.gitignore`; never force-add an ignored file.

3. **Build logical commit groups**
   - Partition the eligible files into the smallest coherent groups that keep the repository
     building, in dependency order.
   - Keep a canonical source and its generated copies in the same group (for example, `.ia/` and
     the files `pnpm ai:sync` writes; the `emovere` preset and the files Spec Kit materializes).
   - Keep tests with the change they verify. Keep `docs/` changes with the code they describe
     (principle VIII), unless they are independent.
   - Keep formatting-only, documentation-only, configuration and feature changes separate when
     their purposes are independent.
   - A file belongs to one group only. Do not split a file by hunk or use interactive staging.
   - Treat changes already staged as the owner's intent. If they span several groups, say that the
     index will be reorganized after approval, without touching the worktree.
   - If there is nothing eligible to commit, report it and stop.

4. **Validate the proposal**
   - Run `git diff --check` on the proposed unstaged changes and `git diff --cached --check` on
     the staged ones.
   - When the gate scripts exist (from the `bootstrap` spec on), also run the non-mutating checks
     that cover the proposed files, at least `pnpm leaks:check` and the commit-author check
     (`node tooling/checks/author.ts`).
   - Never run auto-fix or formatting commands that write files unless the owner asks.
   - If a required check fails, stop before asking for approval and report the failure. Bypass a
     failed check only when the owner explicitly authorizes that exact bypass.

5. **Write a message for each group**
   - Conventional Commits: `<type>(<optional-scope>): <concise imperative subject>`, with `feat`,
     `fix`, `docs`, `test`, `refactor`, `chore`, `build` or `ci`.
   - Describe the result, not the activity. Cite spec, ADR or SP IDs in the body when they apply.
   - End every message with the attribution line of the agent that creates the commit:
     `Co-Authored-By: Codex <noreply@openai.com>` (owner decision, 2026-10-12).

6. **Present the complete plan and pause**
   - Show every commit in execution order:

     | # | Commit message | Files | Rationale |
     |---|----------------|-------|-----------|
     | 1 | `type(scope): subject` | explicit paths | why these files form one atomic change |

   - Flag every file in the plan that was not changed in this session (constitution: "before a
     requested commit, present what goes in and flag any file not changed in the session").
   - List the checks run, the exclusions with their reasons, the changes left out, and any index
     reorganization.
   - Ask one explicit question: **"Aprova a execução de todos os commits deste plano?"**
   - Accept only an unambiguous approval of the whole plan. Stage nothing before it.
   - If the owner rejects or changes any group, revise the whole plan and ask again.

## Phase 2 — Execute the approved plan

The approval authorizes `git add -- <path>...` and `git commit` for every group in the plan, in
order, with no further confirmation between groups.

7. **Prepare the index**
   - Re-run `git status --short`. If the worktree differs materially from the approved plan, stop
     and ask for a new approval.
   - If staged files span several groups, unstage only those paths with
     `git restore --staged -- <path>...`, which leaves the worktree untouched.
   - Never use `git add .`, `git add -A`, `git commit -a`, wildcards or interactive staging.

8. **Create each approved commit in order**
   - Stage only the group's explicit paths with `git add -- <path>...`.
   - Check `git diff --cached --stat` and `git diff --cached`: the staged diff MUST match the
     approved group only. Run `git diff --cached --check`.
   - Commit non-interactively with the approved message, passed through a here-document or a
     message file, never interpolated into the shell command.
   - Verify with `git show --stat --oneline --summary HEAD` before the next group.
   - If a validation or a commit fails, stop the sequence. Do not roll back the commits already
     made; report the completed and the pending groups.
   - Never amend, push, tag, open a pull request or change remote state.

9. **Verify the final state**
   - Run `git status --short`.
   - Confirm each approved group was committed exactly once, and list what remains.

## Completion Report

- Hash and subject of every commit created, with its files or a short diff summary.
- The checks run and their results.
- Completed, pending, excluded, unstaged and untracked changes.
- An explicit statement that nothing was pushed.

## Done When

- [ ] The eligible changes were grouped into an ordered plan of atomic commits
- [ ] The owner approved the whole plan before any staging or commit
- [ ] Every approved commit was created, or the completed and pending groups were reported
- [ ] Only explicit, reviewed paths were staged
- [ ] No real data, database, export file or secret was committed
- [ ] The required checks passed, or an owner-authorized bypass was recorded
- [ ] The resulting commits and the remaining worktree state were verified
- [ ] No remote state was changed
