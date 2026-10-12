# Architecture and product decisions (ADRs)

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

| ADR | Decision | Rationale |
|---|---|---|
| ADR-001 | Monorepo with a modular domain in pure TypeScript and a local-first app; no server in Phase 1. | Fast tests, clear boundaries and a smaller surface. |
| ADR-002 | No AI chatbot or AI therapist. | Risks of anthropomorphization and free-form advice. |
| ADR-003 | AI only produces structured, reviewable outputs. | Control, explainability, evals and fallback. |
| ADR-004 | Small daily actions (Phase 3), from the project's own catalog, framed as wellbeing. No rules engine selects interventions. | The app does not recommend treatment based on symptoms; Emovere is not a medical device. |
| ADR-005 | Specific consent before each AI purpose. | Sensitive data, agency and privacy. |
| ADR-006 | No monitoring, no deterioration review, no automatic escalation. | There is no clinical capacity to promise a response. |
| ADR-007 | Sensitive data kept out of third-party observability, with a canary test. | Leak surface. |
| ADR-008 | Clinical catalog and clinical policy versioned as code. | Review, audit and rollback. |
| ADR-009 | Real data never goes into the repository, whoever it belongs to. | Demonstrations without exposing anyone. |
| ADR-010 | Mobile app built with Expo/React Native (not a PWA). | Reuses React and TypeScript; one codebase for iOS and Android. |
| ADR-011 | The code calculates; the AI only writes. | Deterministic truth; AI is used only for wording. |
| ADR-012 | Encrypted local database; deleting means erasing the key. | Effective deletion. |
| ADR-013 | Help counter only in aggregate. | Asking for help must not become data linked to the person. |
| ADR-014 | `LLMProvider` with on-device AI and a server that receives only the `Pattern` (Phase 2). | The journal never leaves the phone; data minimization and international data transfer. |
| ADR-015 | Wellbeing positioning with controlled language. | Emovere complements, never replaces, professional care and is not a medical device (see [Language](../product/02-language.md)). |
| ADR-016 | Money is kept separate from data and from care: health data is never sold, shared or used for advertising, and no one pays or receives commissions for referrals to professionals. | Privacy and the professional ethics of psychology. |
| ADR-017 | The report exists only as a file generated on the device. | No hosted link that could leak. |
| ADR-018 | Data stays only on the device in Phase 1; no health-data server. | Privacy, less infrastructure and less risk for a solo maintainer. |
| ADR-019 | No account in Phase 1; lock by biometrics or PIN. | Less data and less friction; help is available before unlock. |
| ADR-020 | Psychological safety as a testable requirement (SP-01 to SP-27). | Protections become acceptance criteria and tests, not just intentions. |
| ADR-021 | Insights do not describe symptom trajectories and do not predict states. | Avoids monitoring and prognosis, which are non-goals. |
| ADR-022 | Insight rule: 2 windows of 28 days, ≥ 6 days per group, ≥ 1.5 points in the same direction, evaluated every 28 days; calculation definitions; simulation as a test. | In the simulation, this rule gives fewer false insights and more true ones than 2 × 14 days (see the [false-insight simulation](../research/false-insight-simulation.py)). |
| ADR-023 | Factor model: a closed list of up to 4 pairs; medication, food and substances are banned; the person's own tags stay outside the engine. | Without factors there are no insights; a dangerous factor could lead someone to stop treatment. |
| ADR-024 | No project server in Phase 1; remote configuration that can only turn features off. | Smaller surface and less personal data to handle under the LGPD (Brazil's data protection law); the emergency brake stays safe even if the configuration file is tampered with. |
| ADR-025 | 18+ via the app stores' age verification; Brazil only in Phase 1. | Brazil's ECA Digital does not accept self-declared age; the crisis resources only apply in Brazil. |
| ADR-026 | Closed beta before the public release, with stopping rules. | Measure unwanted effects safely. |
| ADR-027 | Help before unlock shows public resources only. | Personal contacts would be exposed to anyone who picks up the phone. |
| ADR-028 | Database excluded from the system backup; a key that does not depend only on biometrics. | Otherwise the journal would go to the cloud, and changing biometrics would erase the journal. |
| ADR-029 | Public repository from the first commit, with routine protections: real data never leaves the phone; checks at commit time and in CI; logs without content; images only from the demo build; no license until legal review. | Day-to-day content could only leak through the development routine. |
| ADR-030 | Two public repositories: the app (TypeScript) and the AI lab (Python: RAG library, text reviewer, evals, simulation). A versioned contract between them; the app never imports from the lab. | An open license is possible for the library; RAG and agents stay out of the app by construction. |
| ADR-031 | Spec-driven development with Spec Kit in both repositories: a constitution derived from this product specification; specs with the SP criteria as acceptance criteria; clinical questions are never answered by an agent; gates in CI. | The maintainer's working method, applied in the open. |
| ADR-032 | Spec Kit in a lean format: one artifact per phase (`spec.md`, `plan.md`, `tasks.md`) and a rule for who decides what, with the clinical category going to the owner and the clinical co-author, and a `Decided without asking` section in every artifact (see the [constitution draft](../constitution-draft.md), v0.2.0). | Avoids documentation spread across 8 to 10 files per spec and questions to the owner that add no value to the product. |
