# Vision and scope

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Vision

Build a private **self-knowledge tool** that helps adults **record how they are, notice patterns in their own records, plan small actions and bring what they learned to the conversation with their professional**.

Emovere **complements, and does not replace,** care with a psychologist, psychiatrist, CAPS (public psychosocial care centers), UBS, UPA, emergency room or other services. It is not therapy. It does not diagnose, assess risk, prescribe or monitor the person.

AI stays in the background and **only helps deliver the insights**: it turns patterns that the code has already computed into clear text, and it organizes the journal into drafts that the person reviews. There is no chatbot, "AI companion" or virtual therapist.

Today the project is a test of the idea: psychologists evaluate it first, and only then comes legal review. The learning in technology and psychology is worthwhile either way.

## Problem

Anxiety and depression can reduce energy, clarity, initiative and memory of what helped or made things worse over the days. Scattered notes and generic advice tend not to turn into action, and many people arrive at their session without remembering what happened during the week. At the same time, a product that looks like clinical care, or that responds freely to intense distress, can create dependence, delay the search for care or produce unsafe guidance.

Access to care is also unequal: some of the people who would benefit from professional care cannot pay for it.

The product problem is to create everyday support that is **useful without expanding the clinical promise**: turn brief entries into self-knowledge, awareness of patterns and small next steps, while preserving autonomy, privacy and the connection with real professionals.

## Goals

### Product

1. A check-in and journal easy enough for low-energy days: in the default mode, three questions, and one answer is enough to save; everything else is optional.
2. Help the person notice relationships between mood, anxiety, energy and daily factors **in their own records**, without interpreting their mental state.
3. Make it easier to prepare the conversation with the professional, with the person in full control of what is shared.
4. Offer structured self-knowledge exercises (thought record), without presenting them as treatment. In Phase 1, capture only (see J2 in [Personas and journeys](03-personas-and-journeys.md)).
5. Provide a clear and immediate help flow for intense distress, without claiming monitoring or emergency response.

### Business

1. Sustain the product without monetizing data: a paid convenience plan from Phase 3.

### Learning and engineering

1. Learn technology and psychology in practice, with a focus on safety in digital mental health (readings in [References](19-references.md)).
2. A domain in pure TypeScript, with DDD and TDD, and a local-first app with Expo.
3. Evaluate rules by simulation before coding them; in Phase 2, if kept, AI engineering with evals (Python).
4. Honest documentation: ADRs, hazards, privacy, safety criteria and open decisions.

## Non-goals

- Diagnosing, assessing or classifying the person's mental state or risk; prescribing, adjusting or recommending medication.
- **Monitoring for worsening** (a "deterioration review" is not part of v1) or triggering alerts about the person.
- Showing symptom trends as an insight ("your anxiety got worse/better"). Trends appear only in the history and in the report that the person generates.
- Predicting emotional state ("80% chance of anxiety tomorrow").
- **Interventions that react automatically to a detected state** (JITAIs), in Phases 1 to 3.
- **Passive data collection** (location, sensors, phone screen time), in Phases 1 to 3.
- **Labeling the person's behaviors** (e.g., "avoidance"). The person can mark an activity as postponed.
- Claiming that the app treats, supports treatment, reduces symptoms or prevents suicide.
- Replacing psychotherapy, psychiatric assessment, crisis services or emergency care.
- Holding open-ended conversations with AI, simulating a therapeutic bond or using the language of clinical authority.
- Sending journal content to professionals, family members or contacts without the person's explicit action and consent.
- Community, leaderboards, streaks, achievements, advertising or any mechanic that rewards data exposure.
- Selling, sharing or using health data for advertising or behavioral profiling.
- Paying professionals, or receiving commissions from them, for referrals.
- Processing data of people under 18.

## Product principles

| Principle | How it is applied |
|---|---|
| Safety before engagement | No retention metric justifies intrusive notifications, guilt or a suggestion without safety validation. |
| The person keeps agency | Every suggestion can be ignored, postponed, edited or turned off; there is no language of obligation. |
| Professional care is central | The app helps prepare and record the conversation; it does not compete with the professional's role. |
| Structure, not conversation | Short flows, guided fields and approved content replace free-form generated advice. |
| **The code computes, the AI only writes** | Patterns and numbers come from deterministic computation; the AI only drafts and organizes, under validation (see [Insights and AI](08-insights-and-ai.md)). |
| The person names, the app does not label | Emotions, needs and behaviors are named by the person; the app never infers mental state. |
| Smallest effective intervention | Suggestions start small and low-risk. |
| **Minimum effective interaction** | The product does not try to maximize sessions, notifications or minutes of use. The ideal: 30 seconds in the morning, live your life, 30 seconds at night. |
| **The person controls the tracking** | Light, Regular and Detailed modes; a 7-day pause; hidden numbers. None of these deletes history, and there is no guilt on return (see [Clinical safety](07-clinical-safety.md)). |
| **Universal precaution** | The same help line for everyone, at fixed moments (weekly review, report, onboarding), never tied to the notes (SP-23). |
| Privacy by default | Minimal collection, clear controls, effective deletion and no monetization of health data. |
| **Safety and rights never behind payment** | Help, check-in, journal, basic report, export and delete are always free. |
| Practical explainability | Every insight shows the data, the n, the period and the limit of the inference. |
| Equity and accessibility | Plain language, tone and pace preferences, accessible navigation and testing with different cultural contexts. |
| Public rigor | The documentation states limits, metrics, trade-offs, known failures and revisable decisions. |
