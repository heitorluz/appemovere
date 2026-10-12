# UI and UX

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Principles

- **Calm and non-judgmental.** Mood colors avoid "green = good, red = bad"; a neutral, warm palette; no streaks, achievements or confetti.
- **Logging in seconds.** In the default mode there are three questions, and one is enough; everything else is optional.
- **The person names it; the app does not label.** Emotion words are chosen from a simple scale.
- **Help one tap away on every screen,** including before unlock (public resources only) and offline.
- **Insight as an "evidence card":** sentence + mini chart + n + period + "pode ser coincidência" ("it may be a coincidence") + actions (take it to the session, this doesn't make sense, I don't want to track this, close).
- **"Por que estou vendo isso?" ("Why am I seeing this?") with a calendar:** it shows the days that were used, not just the numbers.
- **Visible origin:** excerpts used by the AI are highlighted in the original text (Phase 2).
- **Visible privacy:** lock, optional PIN, quick exit and generic notifications.
- **Trauma-informed design** (Chayn): safety, agency, equity, privacy, accountability, plurality, shared power and hope.
- WCAG 2.2 AA accessibility; large fonts; short sentences; reduced motion; dark mode.
- **Mobile patterns:** a bottom bar with 4 tabs (Início, Diário, Revisão, Sessão — Home, Journal, Review, Session) and a help button fixed at the top; large touch targets; the system font; gentle haptics only to confirm a log.
- A check-in widget on the phone's home screen: only in a future phase, and always with generic text.

## Official visual direction: "Linho e anil"

The official visual direction is **"Linho e anil"** ("Linen and indigo"). Two alternatives were compared on the same five screens and are kept for reference: "Lavanda" ("Lavender": one question at a time, answered by tapping the number) and "Caderno" ("Notebook": paper and graphite).

- **Prototype:** a private prototype exists (fictional data only); screens will be ported as the specs are implemented.
- **Palette:**

| Role | Color | Use |
|---|---|---|
| Background | `#F3F0EB` | Screen background (linen) |
| Surface | `#FCFBF9` | Cards and tab bar |
| Surface 2 | `#EAE5DE` | Soft highlights, such as the universal help line |
| Border | `#DDD6CC` | Borders and dividers |
| Text | `#2A2724` | Main text |
| Text 2 | `#4E4943` | Secondary text |
| Caption | `#645E57` | Captions and inactive tabs (5.6:1 contrast on the background) |
| Indigo | `#34518A` | Actions, selection and focus (white text: 7.8:1) |
| Soft indigo | `#E1E6F1` | Active tab and selected items |
| Amber | `#B06A28` | Charts: days **with** the factor (4.1:1 contrast on the surface and 3.4:1 on the bar track) |
| Light amber | `#D9934A` | Only in the brand symbol, which is decorative |
| Dark amber | `#8A4A12` | Amber text and the delete action |

- **Dark mode:** background `#1C1B19`, surface `#262422`, text `#EDE8E1`, light indigo `#A9BCEB`.
- **Typography:** the system font, which follows the text size chosen on the phone; headings 28–32 px, body 16–18 px, captions 13–15 px.
- **Shape:** cards with 16–20 px corners; pill buttons 52–56 px tall; touch targets of at least 44 px.
- **Patterns:** "Preciso de ajuda" ("I need help") at the top right of every screen; a bottom bar with 4 tabs (icon + text); Settings at the top of Home; the check-in shows the three 0–10 sliders on the same screen, with a hollow marker while a question is unanswered; "Registrado" ("Saved") with no chart; the evidence card shows bars and the average.
- **Emotion word — feelings wheel:** in the Detailed check-in and in the thought capture, the person picks one of 6 core feelings (Feliz, Surpreso, Tranquilo, Triste, Bravo, Medo — Happy, Surprised, Calm, Sad, Angry, Fear) and, if they want, the closest word among 12 (the two rings of a Portuguese-language feelings wheel). Both steps are optional: the person can skip the emotion or stop at the core feeling. The person chooses, and the words never enter the pattern calculation (ADR-023, SP-07). The final list belongs to the clinical co-author (see [Open questions](18-open-questions.md)). An alternative (a mood × energy grid) is kept for reference in the prototype.
- **Chart amber:** charts use `#B06A28` for the evidence card and for the "Por que estou vendo isso?" calendar; `#D9934A` is not used in charts. **Fact** (calculated contrast): `#D9934A` has about 2.5:1 contrast on the surface, below the 3:1 that WCAG requires for graphics; `#B06A28` has about 4.1:1.

## Phase 1 screens

0. **Onboarding (3 or 4 screens):** what the app is, what it is not, what to do in a crisis, where the data lives; "padrões podem levar semanas e podem não aparecer" ("patterns can take weeks and may not appear"); reminders only if the person wants them.
1. **Unlock:** biometrics or PIN + help button, which before unlock shows only public resources.
2. **Home:** "Como você está agora?" ("How are you right now?") (Regular mode: mood, anxiety, energy) + fixed help button.
3. **Detailed check-in (optional):** emotion on the feelings wheel (the core feeling, and the closest word if the person wants), context, note; hours of sleep in Detailed mode.
4. **Evening log (optional):** "O que teve hoje?" ("What happened today?") — tags from the closed list of factors, or "nada hoje" ("nothing today").
5. **Journal and thought capture.**
6. **Review:** history and calendar; insights every 28 days, or "ainda não há registros suficientes" ("there are not enough entries yet"); the universal help line.
7. **For the session:** agenda, period, selection, preview and report generation.
8. **Help:** before unlock, CVV 188 (call and chat), SAMU 192 and UPA (urgent care units); after unlock, also the support plan. "Este app não monitora você." ("This app does not monitor you.")
9. **"Como buscar acompanhamento"** ("How to find professional support").
10. **Settings:** tracking mode, pause, hide numbers, lock and PIN, screenshots, notifications, consents, export, import and delete.

## Reference apps and patterns (what to reuse and what to avoid)

| Reference | What to reuse | Caution |
|---|---|---|
| How We Feel — Mood Meter | Two axes (energy × pleasantness), 144 words; the person chooses the word and the context | The red quadrant can feel like an alarm |
| Apple — State of Mind (iOS 17+) | Continuous scale from very unpleasant to very pleasant; blue/orange colors (no red/green); "what's influencing you" | — |
| Daylio | Two-tap logging; color-coded history | Achievements and gamification: do not use |
| Bearable | "Days with × without the factor" comparison; heat-map calendar | Speaks of "% effect" — avoid effect or cause language |
| Ponderwell | One-tap "Prep Sheet" for the session; no account, no cloud, no AI | English only |
| Chayn | Trauma-informed design principles; a large exit bar on every page | — |
| JMIR Mental Health (2024) | Safety plan components in apps: support people, strategies, warning signs | — |
| Galleries and kits | Screensdesign (Daylio, Bearable), Dribbble, Craftwork (Happyer), Gumroad (Lumio); Mindfree case study | Kits with a chatbot or gamification (e.g. Mindify): do not use those parts |

## How to build

- **Expo** (current SDK: 58) + Expo Router + TypeScript: reuses the maintainer's existing React skills.
- Components: **React Native Reusables** (the React Native equivalent of shadcn/ui, built on NativeWind, the Tailwind of React Native) or Tamagui/gluestack-ui.
- Charts: a native charting library (e.g. Victory Native), with labels and a screen-reader description.
- Device features: expo-local-authentication (biometrics), expo-secure-store (key), expo-sqlite with SQLCipher (encrypted database) and expo-notifications (local reminders).
- Backup: `android.allowBackup` turned off in the Expo configuration; on iOS, backup exclusion applied to the database files (may require native code).
- Keyboard: suggestions and learning turned off in journal fields (may require native code on Android).
- UI tests: Maestro for E2E flows on both systems; React Native Testing Library for components.
- Prototype: the Phase 1 screens exist in a private prototype that follows the official direction above; screens will be ported as the specs are implemented. Third-party kits are only a starting point.
