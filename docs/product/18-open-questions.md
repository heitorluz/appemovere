# Open questions

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## For the clinical co-author (Stage 0.2)

- Factor list and pairs; thresholds for the continuous factors.
- Text of the universal precaution (SP-23), of the help screen and of the "Como buscar acompanhamento" ("How to find professional support") page.
- Does thought reappraisal go into the product? When?
- List of terms for the journal safety net.
- Parameters: minimum effect, false-insight limit, "uso excessivo" ("excessive use"), "vários registros extras" ("several extra entries") and the stopping-rule thresholds.
- How to communicate uncertainty ("pode ser coincidência" — "it may be a coincidence") to people with intolerance of uncertainty, without feeding worry?
- Specification of the one-page session report.
- "Relevant change" (SP-08): what lets an insight come back before 56 days?
- From what share of weekend days does the card say a pattern "coincides" with weekends?
- Rumination check: answer options and the text of each.
- Excessive use: which signals count (check-ins per day? app opens?), besides the numbers.
- When the safety net blocks insights, what text does the review show next to the help offer?
- Emotion words (feelings wheel; see [UI and UX](14-ui-ux.md)): keep the 12 words for each feeling? The words are in the masculine form (Portuguese is gendered): use nouns, the "(a)" form, or a form-of-address preference in Settings? Should choosing "Sem esperança" ("Hopeless") or "Deprimido" ("Depressed") offer the help screen, like the journal safety net? What to do with words that appear twice ("Ansioso" — "Anxious" — under Feliz and Medo; "Confiante" — "Confident" — under Feliz and Tranquilo)? The origin and license of the wheel still need to be confirmed.

## Product

- Session report: when an agenda item points to a deleted entry, does the report show "registro removido" ("entry removed") or leave the item out? (The person already reviews and removes items before generating the report.)
- Phase 2: when the person deletes a journal entry, are the excerpts already copied into a thought record deleted too?

## Repository

- Licenses: separate licenses for code and content, to be decided after legal review (ADR-029).

## Technical

- Calculation definitions still to be decided (see [Insights and AI](08-insights-and-ai.md)).
- Phase 2: the server-side AI provider, if the server is kept; how many users will have on-device AI; Gemini Nano support for Portuguese.
- Billing: through the app stores (~15% for small developers) or, in Brazil, external payment?
