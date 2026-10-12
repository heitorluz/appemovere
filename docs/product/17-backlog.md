# Backlog by stage

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Stage 0.1 — Personal use (maintainer only)

- [ ] Factor list and pairs (draft, to be reviewed with the clinical co-author) and calculation definitions (ADR-022, ADR-023).
- [ ] Repository: domain built with TDD; parameterized insight rule; simulation ported as a test (SP-22).
- [ ] Minimal app: check-in by mode, evening log, journal, thought capture, session agenda, report and help (before and after unlock).
- [ ] Device protections: excluded from backup (SP-25), key independent of biometrics (SP-26), keyboard, screenshots and PDF.
- [ ] Three builds: the maintainer's personal build, development and demo.
- [ ] ADRs 001–032 written (see [ADRs](../decisions/adrs.md)).
- [ ] [Hazard log](../safety/hazard-log.md) updated with every release.
- [ ] Friction points noted, without journal content.

## Stage 0.2 — Review by psychologists

- [ ] Demo build with the personas.
- [ ] Review script; 5 to 10 psychologists; clinical co-author chosen.
- [ ] Review of texts, factors, hazards and stopping rules; clinical decisions recorded in the `Clinical Decision Log`.
- [ ] Specification of the one-page session report and of the session agenda.
- [ ] Accessible design system and reviewed wireframes.

## Stage 0.3 — Legal and compliance review

- [ ] Legal review.
- [ ] Formal consultations with regulators before public launch.
- [ ] Store developer accounts; privacy policy and support page.
- [ ] Support protocol (SP-27); emergency brake (SP-24); continuity plan.

## Closed beta

- [ ] Consent form; 10 to 20 invited participants; about 8 weeks; interviews at the end.
- [ ] Stopping rules active; rumination check; unwanted-effect button.

## Phase 1

- [ ] Onboarding with age verification through the app stores (ADR-025), consents and preferences.
- [ ] Check-in by mode (Light/Regular/Detailed), "Agora não" ("Not now") button, evening log and a confirmation without a chart.
- [ ] Journal and thought capture.
- [ ] History, calendar and review.
- [ ] `Pattern` calculation + cards from a fixed template, with `NO_INSIGHT`, a limit per evaluation, no repetition and "Por que estou vendo isso?" ("Why am I seeing this?").
- [ ] 7-day pause, hide numbers, rumination check, "relatar efeito indesejado" ("report an unwanted effect") and an offer shown on excessive use (on the device only).
- [ ] Text linter with the list of banned terms, in CI.
- [ ] Session agenda and session report.
- [ ] Help screen before unlock (public resources only) and offline + support plan + `HelpCounter`.
- [ ] "Como buscar acompanhamento" ("How to find professional support") page.
- [ ] Lock by biometrics and PIN, content hidden in the app switcher, discreet local notifications and quick exit.
- [ ] Export, import (encrypted file) and delete (erase the key and the database).
- [ ] CI: domain tests, simulation, E2E on iOS and Android, network canary test and secrets scanning.
- [ ] Store listings that follow [Language](02-language.md); privacy labels; health app declaration on Google Play; distribution in Brazil only.
- [ ] Launch checklist (see [Success criteria](15-success-criteria.md)).

## Phase 2

- [ ] Reassessment: is Phase 2 worth it?
- [ ] `LLMProvider` with on-device adapters (iOS and Android) and a server that receives only the `Pattern`.
- [ ] AI drafts insights (schema, validator, fallback).
- [ ] Extractive AI in the thought record.
- [ ] Eval harness in CI (declared n, calibrated judge).
- [ ] AI consent and data protection impact report updated.

## Phase 3

- [ ] Paid convenience plan (purchase through the app stores or external payment in Brazil).
- [ ] End-to-end encrypted backup, outside iCloud.
- [ ] The project's own catalog of small daily actions + formal consultation with regulators.

## Phase 4

- [ ] Offer for companies, with access to individual data prohibited.
