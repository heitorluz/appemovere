# Clinical safety and content

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Product guardrails

- The interface reminds the person, regularly and in an understandable way, that the app complements and does not replace professional care or emergency services.
- The check-in uses its own 0–10 scales. **No PHQ-9 or GAD-7, and no severity bands** ("leve", "moderada", "grave" — "mild", "moderate", "severe"). A standardized instrument is used only if the clinical co-author decides so.
- No model recommends medication, doses, stopping treatment, a diagnosis, exposure or a crisis technique.
- No insight is generated about journal safety net content.
- **Universal precaution (SP-23):** the weekly review, the session report and the onboarding always show the same help line, for everyone (for example: "Se as coisas estiverem pesadas, a ajuda está aqui" ("If things feel heavy, help is here")). It is never linked to scores: the app does not react to numbers, so that it does not become triage and does not give false reassurance when it does not react. Final text by the co-author.
- No gamification, no notification after a long silence, no notifications late at night, and no usage metric used as a clinical signal.

## Help and crisis protocol

The flow is defined, reviewed and versioned with the clinical co-author. It is not an assessment or an automated classification. Access is manual, persistent on every screen — including before unlock, with public resources only — and works offline. The journal safety net is conservative, written by the co-author, and **only opens the resources screen**: it never concludes that there is no risk, never ends the flow, never prevents saving and never replaces human help.

The help screen is short, warm and action-oriented. It encourages contact with a trusted person and presents CVV (188, a free call, 24 hours a day; chat with limited hours) and, in case of immediate risk, SAMU 192, an UPA or a hospital emergency room. (CVV is the Brazilian emotional support and suicide prevention line; SAMU is the public emergency ambulance service; an UPA is a public urgent care unit.) The screen states clearly that the app does not monitor the person and does not contact services or people on their behalf. Each resource shows the date of its last review.

The personal support plan follows the components of the Stanley & Brown (2012) safety plan — warning signs, strategies that help, support people and professional contacts — as mapped in apps by the JMIR Mental Health review (2024). The texts follow the WHO guidance on talking about suicide safely (2023).

## Crisis outside the app

People in distress also write to the support email, in store reviews and on social media.

- The support email replies automatically with the crisis resources and a notice that the inbox is not read in real time (SP-27).
- A one-page protocol, reviewed by the co-author: what to reply, how quickly, and what never to say; a reply template for store reviews.
- "Relatar efeito indesejado" ("Report an unwanted effect") uses closed options; if there is free text, the notice "não lemos isto em tempo real" ("we do not read this in real time") sits next to it.
- Reading these messages carries a real weight: the reading is shared, and agreed with the co-author.
- The legal duties that apply when such a message is received are part of the legal review.

## Content catalogue

- **Phases 1 and 2:** only self-knowledge content (thought capture, short psychoeducation), original and clinically reviewed.
- Non-commercial prototypes and demos may use "Doing What Matters in Times of Stress" (WHO, CC BY-NC-SA 3.0 IGO), with attribution. **The paid product may not.**
- Reference books (Beck, Martell, Clark & Beck) are study material; their exercises and worksheets are not copied into the app.
- **Phase 3:** small daily actions, clinically co-authored, framed as well-being (not linked to symptoms of disorders).

## Clinical governance

- Clinical co-authorship: a psychologist registered with the CRP (Regional Psychology Council), paid through contracted fees — never a commission. The co-author is also the **clinical safety officer** (following the DCB0129 model) and, if the psychology council requires one, the technical lead ("responsável técnico").
- Any change to the catalogue, the safety policy, interface thresholds, the journal safety net, the factor list or the help text requires a clinical review recorded in the `Clinical Decision Log`.
- **Hazard log:** the [hazard log](../safety/hazard-log.md) is reviewed with every version and after any incident. The **stopping rules** live there.
- Clinical safety incidents have an owner, a severity, a containment deadline, a root cause analysis and a criterion for reopening.

## Psychological safety

Mood tracking can help some people and make others feel worse. That is why the person controls how much they track, and the app itself measures whether it is doing harm.

- **Fact:** in a systematic review of 77 studies of mood monitoring in depression and bipolar disorder, only 19% reported adverse effects; the pooled prevalence was 4%; the authors point to serious under-reporting and call for systematic monitoring (Astill Wright et al., 2025).
- **Tracking modes:** Light (1 question), Regular (mood, anxiety and energy), Detailed (+ sleep hours and a note). **Factory default: Regular**, with every question skippable. The evening log (factors) is optional in all modes. Switching modes never deletes history.
- **Pause and hidden numbers:** pause tracking for 7 days, or keep logging without seeing averages and charts for a while. On return, no guilt message. Meanwhile, the insight evaluation keeps running, but the cards only appear on return.
- **Pace:** reminders only in the morning and in the evening; extra entries are allowed, with no chart right away; after several extra entries in a day, a gentle offer ("quer só registrar e olhar depois?" ("want to just log it and look later?")) — never a block. What counts as "several" is defined with the co-author.
- **After a high score:** only "Registrado" ("Saved") and the help button in view. No automatic suggestion based on the number.
- **Excessive use:** a simple rule computed only on the device and never sent; at most one offer per month ("quer esconder as métricas por alguns dias?" ("want to hide the metrics for a few days?")); it talks about the use of the app, never about the person; it can be turned off. The numbers are defined with the co-author.
- **Rumination check:** at most every 4 weeks, skippable: "Acompanhar seu humor aqui tem ajudado, ou tem feito você pensar mais do que gostaria em como está?" ("Has tracking your mood here been helping, or has it made you think about how you are more than you would like?"). A negative answer **offers** Light mode, hidden numbers or a pause.
- **Unwanted effects:** a "relatar efeito indesejado" ("report an unwanted effect") button and the check above; self-reported only, never inferred; anonymous, aggregated sending only with consent; reviewed through the incident process. Taxonomy: `tracking_increased_anxiety`, `tracking_increased_rumination`, `insight_caused_distress`, `recommendation_caused_guilt`, `user_felt_judged`.
- **No mode hides help.**
- **Test with people with lived experience**, in addition to professionals: with consent, the right to stop, help resources at hand and no real journal.

### Acceptance criteria (SP)

The numbers in SP-06 to SP-08 and SP-22, and the definitions of "excessive use", are proposals to be calibrated with the clinical co-author (see [Open questions](18-open-questions.md)).

| ID | Criterion | How to test |
|---|---|---|
| SP-01 | In Light mode there is a single question; in Regular mode (the default), answering one of the three is enough; no flow has a mandatory text field | UI tests |
| SP-02 | Skipping or missing a check-in produces no message, color, notification or visual "missed" change | E2E |
| SP-03 | No screen shows day streaks, points, achievements or completion % | Text linter + UI review |
| SP-04 | No text contains forbidden terms: diagnoses, "piorou" ("got worse"), "falhou" ("failed"), "meta não atingida" ("goal not met"), "você deve" ("you must"), AI first person ("eu" ("I"), "percebi" ("I noticed"), "estou preocupado" ("I am worried")) | Text linter in CI (content and translation files) |
| SP-05 | After a check-in, the only response is the confirmation; no immediate chart or insight | E2E |
| SP-06 | The engine returns `NO_INSIGHT` when: in either of the two 28-day windows, any group has fewer than 6 days; the difference is smaller than 1.5 points in either window or changes direction; the factor appears on fewer than 25% or more than 75% of the days; there is journal safety net content in the period | Unit tests in the domain |
| SP-07 | At most 4 pairs tested (closed list, ADR-023) and 2 insights per evaluation | Unit tests |
| SP-08 | An insight taken to the session, disputed or muted does not reappear for at least 56 days, unless there is a relevant change | Unit tests |
| SP-09 | No insight describes a symptom trajectory ("subiu" ("went up"), "piorou" ("got worse"), "melhorou" ("got better")); only relations between records | Validator + linter |
| SP-10 | Every insight has "Por que estou vendo isso?" ("Why am I seeing this?") with the days used (on the calendar), the n and the method in plain language | UI tests |
| SP-11 | Every insight offers: "levar para a sessão" ("take to the session") / "não faz sentido" ("doesn't make sense") / "não quero acompanhar isso" ("I don't want to track this") / "fechar" ("close") | UI tests |
| SP-12 | All tracking can be reduced (Light/Regular/Detailed), paused for 7 days or have its numbers hidden, without deleting history and without a guilt message on return | E2E |
| SP-13 | In any mode, the help button stays visible and working | E2E |
| SP-14 | Notifications: generic text, no emotional state, no night-time hours, configurable; no notification triggered by absence | Unit tests + review |
| SP-15 | No prediction of a future emotional state on any screen or in any calculation | Architecture review + validator |
| SP-16 | Rumination check at most every 4 weeks, skippable; a negative answer **offers** Light mode, hidden numbers or a pause | Unit + E2E |
| SP-17 | Excessive-use signals computed only on the device, never sent; at most one offer per month; can be turned off | Unit + network canary test |
| SP-18 | Unwanted effects only self-reported, never inferred; anonymous, aggregated sending only with consent; reviewed through the incident process | Process + test |
| SP-19 | Planning (Phase 3): no completion %; replanning without penalty; "dia mais leve" ("lighter day") is always an offer | UI tests |
| SP-20 | Medication, food or weight, and substance use never enter the insights engine; tags created by the person do not either | Unit tests |
| SP-21 | Before unlock, the help screen shows only public resources | E2E |
| SP-22 | The simulated false-insight rate stays below the agreed limit (proposal: 5% of people over 24 weeks, with 4 pairs); the test runs on every rule change | Simulation test in CI |
| SP-23 | The weekly review, the session report and the onboarding always show the same help line, for everyone, with no link to scores | UI tests |
| SP-24 | The remote configuration file can only turn features off; turning off each feature is tested in every version; without internet, the built-in safe default applies | E2E |
| SP-25 | The database never enters the system backup; the test checks both operating systems | Integration test |
| SP-26 | Changing the device's biometrics does not cause data loss | Integration test + manual |
| SP-27 | The support email replies automatically with the crisis resources | Process test |
