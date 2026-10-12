# Constitution History

Newest first. Every amendment adds an entry at the top (constitution, Governance, Versioning).

## 1.1.0 — 2026-10-12 — TDD, DDD, Clean Architecture and Clean Code made explicit

- **Change**: 1.0.0 → 1.1.0. Bump type: MINOR (materially expands principles V and VI and adds
  rules; nothing removed).
- **Summary**:
  - Principle V renamed "Clean Architecture and Domain-Driven Design — Dependency Rule Points
    Inward". It adds the three layers (domain, application, adapters) with their folders, moves
    the ports to the application layer of `packages/domain`, makes the modules of the domain
    model in `docs/` the bounded contexts (use across contexts only through the application API;
    a `shared/` kernel of generic value objects only), and requires the ubiquitous language and
    changes through aggregate roots.
  - Principle VI renamed "Test-Driven Development (TDD): Red-Green-Refactor", with the explicit
    TDD cycle; the gate and the Definition of Done now show RED → GREEN → REFACTOR.
  - Technical Constraints and Stack gains the Clean Code lint limits (complexity ≤ 10,
    function ≤ 50 lines, file ≤ 300 lines, ≤ 3 parameters, nesting ≤ 3).
- **Approvals**: Heitor Luz, technical owner (answers of 2026-10-12: layers in
  `packages/domain`, contexts through application APIs with a minimal `shared/`, the lint limits,
  version 1.1.0 on a dedicated branch). Principles I and IV were not changed.

## 1.0.0 — 2026-10-12 — Ratification

- **Change**: 0.2.2 (draft) → 1.0.0. Bump type: ratification, the first normative version.
- **Summary**: the draft in `docs/constitution-draft.md` (v0.2.2) became
  `.specify/memory/constitution.md` through `/speckit-constitution`, during the Spec Kit setup
  that precedes the `bootstrap` spec. Principles I to VIII and every section were kept verbatim,
  including the NON-NEGOTIABLE markers and the open NEEDS CLARIFICATION markers (SP-22 limit,
  Drizzle + SQLCipher spike, project site location, clinical owner). Only the draft banner was
  removed, the `docs/` link fixed for the new location and the version line filled.
  `docs/constitution-draft.md` now points here.
- **Approvals**: Heitor Luz, technical owner. Clinical owner not yet appointed; principles I and
  IV were not changed.
