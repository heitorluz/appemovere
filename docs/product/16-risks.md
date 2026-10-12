# Risks and mitigation

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

| Risk | Impact | Mitigation |
|---|---|---|
| The person sees the app as therapy | Delay in seeking care | Complementary language (see [Language](02-language.md)); session preparation; J6 (see [Personas and journeys](03-personas-and-journeys.md)); onboarding. |
| False or misread insight | Bad health decision | 2 × 28-day rule (ADR-022); banned factors (SP-20); simulation as a test (SP-22); no insight suggests an action. |
| AI produces inappropriate guidance (Phase 2) | Harm and loss of trust | No chat; AI only drafts text from the `Pattern`; validator; fallback; evals; reassess Phase 2. |
| Failure in crisis content | Potentially severe harm | Help before unlock and offline; universal precaution; journal safety net written by the clinical co-author; resources with a review date. |
| A crisis arrives through support or the app stores | Potentially severe harm | Automatic reply (SP-27); protocol; response template. |
| Journal leak | Personal and legal harm | Encrypted database only on the device and excluded from backup (SP-25); keyboard, screenshots and PDF protected; threat model; network canary test; security review before the closed beta. |
| Physical access to the phone | Exposure to a partner, family or employer | Lock and optional PIN; only public resources before unlock; generic notifications; quick exit. |
| Data loss (phone replaced or lost, biometrics changed) | The person loses their history | Encrypted export with a reminder; key independent of biometrics (SP-26); warning in onboarding; end-to-end encrypted backup in Phase 3. |
| Classification as a medical device | Launch blocked | Controlled language and store listing (see [Language](02-language.md)); no assessment and no monitoring; formal consultation with regulators before public launch. |
| Classification as a psychological service | Registration requirements or design changes | Legal review; formal consultation with regulators before public launch. |
| Insufficient age verification (ECA Digital, Brazil's digital statute for children and adolescents) | Sanctions; minors exposed | 18+ via store age verification (ADR-025); legal review; content that is safe even if read by a teenager. |
| Civil liability | Legal and financial liability | Legal review; hazard log kept up to date (see [hazard log](../safety/hazard-log.md)). |
| Maintainer unavailable | Incident with no response | Continuity plan; clinical co-author and a trusted person informed. |
| Malicious or defective update | Harm at scale | Remote updates only when signed; remote configuration that can only turn features off; SP-13 and SP-14 block a release. |
| Low retention | Revenue too low to sustain the project | Value anchored in the session; low costs; Phase 4 is optional. |
| Cultural bias or inappropriate language | Exclusion and distress | Inclusive research, human review and user testing. |
| Scope grows too much | The product never reaches the public | Stages with prerequisites; ADRs to contain complexity. |
| Rejection or removal by the app stores | Delay or the app taken offline | Apple guidelines 1.4.1, 5.1.1(v) and 5.1.3 and Google's health policy; store listing that follows [Language](02-language.md). |
| Low on-device AI coverage (entry-level Android phones) | Uneven Phase 2 across users | Fixed text template as the default; a server that receives only the `Pattern` as the alternative. |
