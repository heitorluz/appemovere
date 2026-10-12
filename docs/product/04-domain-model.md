# Domain model

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Modules

The app starts with 3 domain modules, which run on the device. In Phase 1 there is no account: identity is limited to consents and local preferences. Everything else is infrastructure.

```text
Tracking                 Insights                 Care & Safety
├── CheckIn              ├── Pattern              ├── HelpResource
├── FactorLog            ├── InsightCard          ├── SupportPlan
├── JournalEntry         ├── SessionAgenda        ├── HelpCounter (aggregate)
└── ThoughtRecord        └── SessionReport        └── SafetyFeedback

Identity & Consent — Phase 1: only consents and local preferences, no account
Infrastructure, not a bounded context — encrypted local database, keys (Keychain/Keystore),
  remote configuration (can only turn features off), local notifications, export;
  LLMProvider only in Phase 2
Phase 3 — Routine (small daily actions) and Billing (store purchase or external payment)
```

| Module | Responsibility | Boundary rule |
|---|---|---|
| Tracking | Check-ins, daily factors, journal and thought records | Does not interpret or recommend. |
| Insights | Descriptive patterns, cards, session agenda and session report | Uses only the person's own data; does not assess mental state. |
| Care & Safety | Help resources, support plan, aggregate counter and reports of unwanted effects | Versioned policy; no monitoring and no triage. |
| Identity & Consent | Consents and preferences (an account only if Phase 3 requires it) | Does not read health content. |

**Hypothesis:** the core domain is the "safe insights engine": a deterministic calculation, a rule tested by simulation, and validated wording.

## Main entities

| Entity | Description and invariants |
|---|---|
| `UserProfile` | Local preferences: region, language, accessibility, biometric lock, optional app PIN, notifications (text always generic), **tracking mode** (Light/Regular/Detailed), **pause** and **hidden numbers** (with a return date). No account in Phase 1. |
| `Consent` | Purpose, text version, date, scope and revocation. Consent for health data is specific and highlighted; without consent, no AI runs and nothing optional leaves the device. |
| `CheckIn` | Dated record; the fields depend on the mode (see [Clinical safety](07-clinical-safety.md)); in Regular mode, answering one of the three questions is enough; no text is mandatory; skipping or missing a check-in is never treated as getting worse. |
| `FactorLog` | Tags for the day, from the closed factor list (see [Insights and AI](08-insights-and-ai.md)), one tap each; sleep hours in Detailed mode. Tags created by the person do not enter the engine. |
| `JournalEntry` | Private text, stored only in the encrypted local database, with a processing state and effective deletion. |
| `ThoughtRecord` | Situation, thought, emotion (chosen by the person) and behavior; the alternative response only if that feature is turned on (see J2 in [Personas and journeys](03-personas-and-journeys.md)); every field is editable; excerpts suggested by AI keep a record of their origin. |
| `Pattern` | A computed fact: factor, outcome, compared groups, means, the n of each group in each window, period and rule (see [Insights and AI](08-insights-and-ai.md)). Never a diagnosis. |
| `InsightCard` | Displayed text + reference to the `Pattern` + template or model version + validator result + state (new, taken to the session, disputed, muted) and the date from which it may reappear (minimum 56 days). |
| `SessionAgenda` | Items "to take to the session": an entry, a topic, or an entry with a note. It refers to the entry only by reference, never by a copy of its content; a deleted entry appears as "registro removido" ("entry removed"). On the device only. |
| `SessionReport` | A selection generated on demand, with explicit choice of content and a fixed header; it exists only as a file generated on the device. |
| `SupportPlan` | Trusted people, what helps and safe places; all optional, offline and visible only after unlock. |
| `HelpResource` | Public resource by region (CVV 188, SAMU 192…), versioned, with the date of its last review. |
| `HelpCounter` | Aggregate, anonymous counter of visits to the help screen, sent only with consent and without a device identifier. |
| `SafetyFeedback` | Answers to the rumination check and reports of unwanted effects, **self-reported only** and with closed options. Stays on the device; anonymous, aggregated sending only with consent. |
| `Intervention` (Phase 3) | A small action from the in-house catalogue: text, limits, version, authorship and clinical review. |
