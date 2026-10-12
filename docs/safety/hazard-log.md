# Hazard log

> Part of the Emovere product specification. Status: draft (v0.1), to be reviewed with the clinical co-author during the evaluation by psychologists. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

A living document. It lists what can go wrong for the people who use the app, how severe and how likely it is, and which protections exist or are still missing. It is referenced by [Clinical safety](../product/07-clinical-safety.md) and reviewed on every release (constitution, principle VIII).

> **Fact:** DCB0129, a standard of the English health system, requires manufacturers of health software to run a clinical risk management process, appoint a clinical safety officer, keep a hazard log (a living document with hazards, assessment and controls) and write a safety case. It does not apply in Brazil; it is used here as a model. _(Source: [NHS England](https://standards.nhs.uk/published-standards/clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems).)_

## How to use it

- **When to review:** on every release — before installing on the maintainer's own phone, before sending a build to psychologists, before the closed beta and before each public release — and after any incident.
- **Who reviews:** today, the maintainer. From the evaluation by psychologists on, the clinical co-author reviews and signs as clinical safety officer.
- **How:** review every row. A new hazard gets a new ID. Nothing is deleted: a resolved hazard changes status.
- **Status:** **Open** (protections missing); **Controlled** (protections built and tested; the remaining risk was accepted by the co-author); **Closed** (the hazard no longer applies).

## Scales

Proposal, to be calibrated with the co-author.

| Level | Severity (S) | Likelihood (L) |
|---|---|---|
| 1 | Mild discomfort | Very unlikely |
| 2 | Passing distress | Unlikely |
| 3 | Relevant distress or data loss | Possible |
| 4 | Serious harm: delayed care, exposure, a poor health decision | Likely |
| 5 | Risk to life or severe harm | Almost certain |

**Priority:** high if S × L ≥ 12 **or S = 5**; medium from 6 to 11; low up to 5.

## Hazards

Initial assessment, made before the new protections. The "From" column says from which stage the hazard applies.

| ID | Hazard | Possible effect | S | L | Priority | Existing protections | Protections to build | From | Status |
|---|---|---|---|---|---|---|---|---|---|
| H-01 | A person in crisis cannot find help, or the resource is wrong or outdated | Severe harm | 5 | 2 | High (S = 5) | Button on every screen; offline; versioned resources | Only public resources before unlock (SP-21); CVV chat; visible review date; Brazil only (ADR-025) | Personal use | Open |
| H-02 | A person in crisis writes to support or to the store and gets no answer | Severe harm | 5 | 3 | High | — | Email auto-reply (SP-27); one-page protocol; reply template for the stores | Closed beta | Open |
| H-03 | A false or misread insight leads to a poor decision (stopping medication, dropping an activity, self-blame) | Moderate to severe harm | 4 | 3 | High (12) | Association wording; "pode ser coincidência" ("it may be a coincidence"); insight limit | 2 × 28-day rule (ADR-022); forbidden factors (SP-20); simulation as a test (SP-22); "Por que estou vendo isso?" ("Why am I seeing this?") with a calendar | Personal use | Open |
| H-04 | Tracking increases rumination or anxiety | Moderate harm | 3 | 4 | High (12) | SP-01 to SP-18; modes; pause; rumination check | Stop rules (below); closed beta | Personal use | Open |
| H-05 | The app delays seeking care ("I'm already taking care of myself") | Moderate to severe harm | 4 | 3 | High (12) | Complement wording; focus on the session | "Como buscar acompanhamento" ("How to find care") page (J6); onboarding | Closed beta | Open |
| H-06 | Text that judges or frightens | Distress | 3 | 2 | Medium (6) | Term linter (SP-04); clinical review | Clinical review also for remote updates | Personal use | Open |
| H-07 | The thought record turns into rumination, self-criticism or reassurance seeking | Moderate harm | 3 | 3 | Medium (9) | Optional fields | Capture only in Phase 1; reappraisal off until the co-author decides (J2) | Personal use | Open |
| H-08 | Journal exposed to a partner, family member or employer | Severe personal harm | 4 | 3 | High (12) | Encrypted database; lock; generic notification | Excluded from backups (SP-25); optional PIN; keyboard; screenshots; PDF; only public resources before unlock | Personal use | Open |
| H-09 | Data loss (new phone, failed update, biometrics change) | Distress; loss of trust | 3 | 3 | Medium (9) | Export; tested migrations | Key independent of biometrics (SP-26); notice in onboarding; clean restart after restore | Personal use | Open |
| H-10 | A minor uses the app | Legal; inappropriate content | 3 | 3 | Medium (9) | — | 18+ through store age verification (ADR-025); content safe even if read by a teenager | Closed beta | Open |
| H-11 | The journal safety net fails or raises false alarms | Severe harm or a scare | 4 | 4 | High (16) | Conservative list; it only opens help | List written by the co-author; universal text; never blocks saving; documented as a net, not detection | Evaluation by psychologists | Open |
| H-12 | The app's silence about very low scores is read as "everything is fine" | Severe harm | 4 | 3 | High (12) | Help always visible | Universal precaution (SP-23), with the co-author's text | Evaluation by psychologists | Open |
| H-13 | An update breaks a safety function (help disappears; a notification shows sensitive text) | Severe harm | 4 | 2 | Medium (8) | End-to-end tests | SP-13 and SP-14 block the release; emergency brake (SP-24) | Personal use | Open |
| H-14 | Compulsive use or dependence on the app | Moderate harm | 3 | 2 | Medium (6) | No gamification; minimal interaction; SP-17 | Definition of "excessive use" with the co-author | Evaluation by psychologists | Open |
| H-15 | The report is used by third parties as a clinical assessment | Personal or legal harm | 3 | 2 | Medium (6) | Sharing only by the person | Fixed header: "Feito pela própria pessoa; não é avaliação" ("Made by the person; not an assessment") | Personal use | Open |
| H-16 | A compromised account or update channel ships malicious code | Severe harm at scale | 5 | 1 | High (S = 5) | — | Two-factor authentication; remote updates only with code signing; configuration that can only switch features off | Legal and compliance review | Open |
| H-17 | The maintainer is unavailable during an incident | Incident without response | 4 | 2 | Medium (8) | — | Continuity plan; a trusted person with emergency access | Closed beta | Open |
| H-18 | The AI (Phase 2) writes something improper despite the validator | Distress | 3 | 2 | Medium (6) | Validator; fixed fallback template; evals | Reassess Phase 2 with Phase 1 data | Phase 2 | Open |
| H-19 | A public promise is not kept (for example, about effectiveness) | Loss of trust; legal | 3 | 2 | Medium (6) | Controlled language | No public claim without evidence and review | Phase 3 | Open |

## What already applies during personal use (maintainer only)

Even with a single user, these hazards exist and the protections apply to the maintainer:

- **H-03** — medication is never a factor in the engine, not even in the personal build.
- **H-04** — the psychological safety protections apply to the maintainer too, including pause and hidden numbers.
- **H-07, H-08, H-09, H-13 and H-15.**

## Stop rules

Proposal, to be calibrated with the co-author. They apply from the closed beta on.

- **Severe harm possibly linked to the app** (self-harm, a crisis attributed to a text or insight): switch the feature off with the emergency brake, notify the co-author within 24 hours and switch it back on only after a root-cause analysis.
- **Rumination check:** if 15% or more of the people answer that tracking "has made them think more than they would like", pause insights for everyone and review.
- **Failure of a safety function** (help button missing, notification with sensitive text): fix it before any other delivery.
- **Suspected data leak:** follow the incident plan agreed in the legal review.
- **No one available to respond to incidents for a long period:** temporarily remove the app from the stores.

## Revision history

| Date | Version | Who | What changed |
|---|---|---|---|
| 2026-10-02 | 0.1 | Draft | Created from the initial assessment of the product specification |
