---
name: speckit-checklist
description: Disabled in this project. The spec quality check runs inside /speckit-specify
  and /speckit-clarify, without a file.
compatibility: Requires spec-kit project structure with .specify/ directory
metadata:
  author: github-spec-kit
  source: preset:emovere
---

# Speckit Checklist Skill

# Checklist (disabled)

This project's constitution (Development Workflow and Quality Gates, *One artifact per phase*)
forbids `checklists/`: a feature produces only `spec.md`, `plan.md` and `tasks.md`.

Do not create, modify or delete any file. Tell the user, in one short message:

- `/speckit-checklist` is disabled in this project, and why (the rule above).
- The spec quality check runs as a step of `/speckit-specify` and `/speckit-clarify`, without a
  file; running `/speckit-clarify` again re-runs it.
- Consistency between `spec.md`, `plan.md` and `tasks.md` is checked by `/speckit-analyze`, which
  records its findings in the `## Analysis` section of `tasks.md`.

User input, for context only: $ARGUMENTS
