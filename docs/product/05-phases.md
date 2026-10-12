# Phases

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

No dates. Each stage opens only when its prerequisites are met.

**The limit that keeps the order safe:** until the end of Stage 0.3, no one other than the maintainer uses the app with real data. Psychologists evaluate it with synthetic data.

## Phase 0 — Foundations

### Stage 0.1 — Personal use (maintainer only)

**Goal:** try the idea in daily use and learn from it.

- Define the engine on paper: the factor list (a draft, to be reviewed with the clinical co-author), the calculation definitions and the rule (see [Insights and AI](08-insights-and-ai.md)). The simulation becomes an automated test (SP-22).
- A repository with the domain built using TDD; a minimal app: check-in by mode, evening log, journal, thought capture, session agenda, session report and help.
- Device protections before the first real data: database excluded from the system backup (SP-25), a key that does not depend only on biometrics (SP-26), keyboard, screenshots and PDF (see [Non-functional requirements](06-non-functional-requirements.md)).
- Three builds: the maintainer's personal build (real data, only on the maintainer's phone), development, and demo (synthetic data).
- [Hazard log](../safety/hazard-log.md) opened and updated with every version.
- Product friction points noted, without journal content.

**Exit criteria:** at least 8 weeks of use; applicable SP tests passing; friction points noted.

### Stage 0.2 — Evaluation by psychologists

- A demo build with the personas and synthetic data.
- An evaluation script: help screen and texts; session report and session agenda; thought capture and the decision about reappraisal (J2); the universal precaution (SP-23); the journal safety net (J4); the factor list; the wording of insights; the hazards they see.
- Conversations with 5 to 10 psychologists. The clinical co-author is chosen among them.
- The co-author reviews the hazard log and the stopping rules.

**Exit criteria:** co-author chosen; texts and hazards reviewed; clinical decisions recorded in the `Clinical Decision Log`; session report specified.

### Stage 0.3 — Legal and compliance review

- Legal review.
- Formal consultations with regulators, with screens and texts in hand.
- With the clinical co-author: support protocol (SP-27), emergency brake tested (SP-24) and continuity plan (see [Non-functional requirements](06-non-functional-requirements.md)).

**Exit criteria:** legal review approves the closed beta; consent form ready; formal consultations with regulators submitted.

## Closed beta

- 10 to 20 invited adults, for about 8 weeks, through the stores' testing channels.
- Consent form; support channel with a protocol; rumination check; unwanted-effect button; interviews at the end.
- Stopping rules active (see the [hazard log](../safety/hazard-log.md)).

**Exit criteria:** no serious harm linked to the app; rumination check below the agreed limit; session report useful to the professionals consulted; responses from the regulators received; age verification resolved (ADR-025).

## Phase 1 — Public (free, adults, no AI)

**The person's question:** "How am I doing, and what keeps repeating?"

**In scope:**

- Onboarding in 3 or 4 screens: what the app is, what it is not, what to do in a crisis and where the data is kept; a notice that patterns can take weeks and may not appear; reminders only if the person wants them.
- Age verification through the stores and an 18+ rating (ADR-025); distribution in Brazil only; Android first, iOS next.
- J1 to J4 and J6; psychological safety (see [Clinical safety](07-clinical-safety.md)); history and calendar; insights with fixed-template text (see [Insights and AI](08-insights-and-ai.md)).
- Biometric lock (with an optional app PIN), content hidden in the app switcher, discreet local notifications and quick exit.
- Export and import (encrypted file) and delete (erases the key and the local database); a clear warning that losing the phone without exporting means losing the history.

**Out of scope:** AI, suggested actions, billing and a server of our own.

**Prerequisites for opening to the public:**

- Terms of use, privacy policy (with the list of what leaves the phone; see [Privacy](13-privacy.md)), legal basis and data-subject request channel, validated through legal review.
- Sensitive texts reviewed by the clinical co-author.
- Responses or guidance from the formal consultations with regulators.
- Store rules met. Apple: remind the person to consult a professional (1.4.1); do not store health data in iCloud or use it for advertising (5.1.3); if there is an account, allow deleting it inside the app (5.1.1(v)). Google: health app declaration, privacy policy and data safety section. Privacy labels consistent with local-first.
- Store listing (name, description, images) checked against [Language](02-language.md).
- Developer accounts approved in the store of the first launch.
- Security, accessibility, export and import tests passed; logs verified to contain no sensitive content.
- Criteria SP-01 to SP-18 and SP-20 to SP-27 passed (SP-19 belongs to Phase 3); see [Clinical safety](07-clinical-safety.md).
- Hazard log reviewed by the co-author; closed beta completed; launch checklist applied.

## Phase 2 — AI in insights (re-evaluate first)

**Before starting:** re-evaluate, with Phase 1 data, whether it is worth it. The fixed-template text remains the official one. AI only comes in where code cannot do the job (extracting excerpts, drafting the report), preferably on the device.

**The person's question:** "How can I better understand what I recorded?"

**In scope:**

- AI drafts insights from the computed `Pattern` (closed schema + validator + fixed-template fallback).
- J2 with extractive AI, optional.
- A draft of the session report, built from computed facts and excerpts chosen by the person.

**Prerequisites:**

- Eval harness in CI, with the n of each set declared (see [LLM evals](11-llm-evals.md)); validators and fallback tested.
- On-device AI where available (Apple Foundation Models on iOS 26+; Gemini Nano on compatible Android phones) and, for other devices, a server that receives only the `Pattern`, with a zero-retention contract and an analysis of the international data transfer.
- Specific consent for AI and an updated data protection impact report.

## Phase 3 — Paid plan

**The person's question:** "What is one small action I can try?"

Phases 1 and 2 are free. Phase 3 adds a paid convenience plan. Safety and rights features (help, check-in, journal, basic report, export, delete) are always free.

**In scope:**

- A paid convenience plan (for example: AI organization of the journal, advanced reports, themes, end-to-end encrypted backup for switching devices — outside iCloud, because of Apple guideline 5.1.3).
- Small daily actions from an in-house catalogue, framed as well-being.

**Prerequisites:**

- Legal review.
- In-house catalogue with clinical co-authorship and clinical review.
- Formal consultation with regulators about the small daily actions.
- Billing method defined: in-app purchase through the stores or, in Brazil, external payment.

## Phase 4 — Companies (optional)

- Licenses for companies (in the context of NR-1, the Brazilian occupational health and safety regulation).
- **Prerequisite:** a contract that forbids any access to individual data; at most, aggregated and anonymous adoption numbers.
