# Personas and journeys

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Personas

The app is open to the adult public. Communication starts with **Marina** (people already in care), because that is where the value (preparing the session) is clearest and the risk is lowest. Rafael and Camila also use it. For people without a professional, the app offers the "Como buscar acompanhamento" ("How to find care") page (J6).

### Marina — person in psychological care

An adult in therapy who arrives at sessions without remembering the important events of the week. She wants to record little data, recognize patterns and bring a summary that she can choose to share.

### Rafael — person with low energy and an unstable routine

An adult with depressive symptoms who feels overwhelmed by long lists. He needs a small next step that is adaptable and free of pressure.

### Camila — person with recurring anxiety

An adult who notices intense worry and avoids tasks. She wants to observe triggers and practice structured exercises, but does not want an app that interprets or labels her thoughts.

### Mental health professional — optional recipient of the report

A psychologist or psychiatrist who receives, outside the app, a file prepared and approved by the person. The professional has no access to the account, no live monitoring and no clinical responsibility delegated by the product. The professional neither receives nor pays referral commissions.

## Priority journeys

> J5 is reserved for Phase 3 and not part of this document.

### J1. Record the day

1. The person opens the check-in. What appears depends on the mode (see [Clinical safety](07-clinical-safety.md)):
   - **Light**: one question, "Como você está agora?" ("How are you right now?"), from very unpleasant to very pleasant.
   - **Regular (default)**: mood, anxiety and energy; one answer is enough to save.
   - **Detailed**: also hours of sleep and a note.
2. No text field is required, and the **"Agora não"** ("Not now") button skips the entry with no consequence.
3. Optionally, the person picks the emotion on the feelings wheel (the core feeling and, if they want, the closest word; see [UI and UX](14-ui-ux.md)), indicates the context and writes a note. This applies in every mode; in Regular mode, the emotion alone is not enough to save (one of the three ratings is, SP-01).
4. After saving, the app only shows "Registrado" ("Saved"): no chart or insight at that moment.
5. Reminders only in the morning and in the evening, and only if the person wants them. Extra entries are allowed, but not requested.
6. **Evening log (optional):** "O que teve hoje?" ("What happened today?"). One tap on each tag from the closed list of daily factors (see [Insights and AI](08-insights-and-ai.md)), or "nada hoje" ("nothing today") when none happened. There is no streak to lose.

### J2. Journal and thought record

- **Phase 1:** free journal and thought **capture**: situation, thought, emotion (picked from a list) and behavior, with the destination "levar para a sessão" ("take to the session"). The questions are always neutral; none asks the person to relive the worst moment.
- **Reappraisal ("alternative response"):** off by default. It enters the product only by decision of the clinical co-author, recorded in the `Clinical Decision Log`, and after the formal consultations with regulators. In the maintainer's personal build, it may be turned on as an experiment.
- **Phase 2 (optional AI, with consent):** if the person taps "organizar" ("organize"), the AI **only extracts literal excerpts** from the text for situation, thought and behavior, and highlights where they came from. **The person picks the emotion and the need** from a list. Nothing is saved without review. The AI does not interpret, label or advise.

### J3. Review, patterns and session preparation

1. The person can open the review whenever they want: history, session agenda and report.
2. **New insights only every 28 days** (see [Insights and AI](08-insights-and-ai.md)). They are descriptive, with the n, the period (the last 8 weeks), "pode ser coincidência" ("it may be a coincidence") and the **"Por que estou vendo isso?"** ("Why am I seeing this?") button, which shows on the calendar the days that were used. Without enough evidence: "Ainda não há registros suficientes para comparar" ("There are not enough records to compare yet"). The first insight can only appear after 8 weeks, and it may never appear.
3. For each insight, the person chooses: "levar para a sessão" ("take to the session") / "não faz sentido" ("doesn't make sense") / "não quero acompanhar isso" ("I don't want to track this") / "fechar" ("close"). An insight already seen or disputed does not return for at least 56 days, unless something relevant changes.
4. **Session agenda:** the person marks entries and notes topics "para levar" ("to bring"). Each item is an entry, a topic, or an entry with a note. If the entry is deleted later, the item stays on the agenda as "registro removido" ("entry removed"), with the note, if any: the agenda keeps only a reference, never a copy of the content. The evening log does not go on the agenda. Removing an insight from the agenda does not undo "taken to the session" or its 56-day wait.
5. **One-page report**, specified with psychologists in Step 0.2 (see [Phases](05-phases.md)): the person chooses the period (by the date of the entries), reviews, removes items and **generates** a PDF or Markdown file. Fixed header: "Feito pela própria pessoa; não é avaliação" ("Made by the person themselves; not an assessment"). A warning appears before sharing. The file has a neutral name and no metadata, and the temporary copy is deleted. There is no hosted link.
6. The review and the report always show the same help line, for everyone (SP-23).

### J4. Seek help in intense distress

1. The "Preciso de ajuda agora" ("I need help now") button is visible on every screen, **including before unlock**, and works offline.
2. **Before unlock**, only public resources: CVV 188 (free call, 24 hours; chat with limited hours), SAMU 192 and UPA/emergency room, with one-tap calling.
3. **After unlock**, also the person's support plan (trusted people, what helps).
4. There is no conversation, triage or risk classification. The app makes clear that it does not monitor the person or contact anyone on their behalf.
5. **Journal safety net:** a conservative list of terms, written by the clinical co-author, searched in every free text of the period: journal, thought records and check-in notes. If a term appears in the period, no insight is generated and the help screen is offered with warm, universal text, never "detectamos que…" ("we detected that…"). It never prevents saving. It is not detection: many cases slip through, and others trigger it without being a crisis.
6. Only an aggregate counter is recorded, not linked to the person, and only with consent.

### J6. Find care

1. A fixed page, "Como buscar acompanhamento" ("How to find care"), reviewed by the clinical co-author: the public network (UBS, CAPS, the public psychosocial care centers), university psychology clinics and CVV.
2. For people without sessions, the insight actions say "anotar para conversar com um profissional ou com alguém de confiança" ("note it to talk with a professional or someone you trust").
3. The question "você faz acompanhamento?" ("are you in professional care?") exists from Phase 1: it is optional, stays only on the device and is used only to adapt the texts.
