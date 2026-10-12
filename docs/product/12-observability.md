# Observability

> Part of the Emovere product specification. Status: draft. Emovere is a self-knowledge journal that complements, and never replaces, professional care. It is not a medical device.

## Metrics

- **Phase 1:** optional crash reporting without content (or none at all); test coverage; result of the engine simulation (SP-22).
- **Product safety metrics:** the rumination check and reports of unwanted effects (`SafetyFeedback`), and visits to the help screen (`HelpCounter`) — only aggregate, anonymous and with consent, with no inference of individual risk. The action thresholds are in the stopping rules (see [Hazard log](../safety/hazard-log.md)).
- Funnel for check-in, journal and export — only with consent, aggregate and without text.
- **Phase 2:** AI latency, failures, timeouts, cost and fallback rate; validator rejections by category.

## Telemetry rules

- **In the app:** no third-party analytics tool; crash reporting only with consent and without content.
- **On the server (Phase 2):** OpenTelemetry with an **attribute allow-list** (deny by default).
- No journal content, prompts, raw responses, direct identifiers or health data in logs, traces or product tools — verified by the network canary test (see [Testing strategy](10-testing-strategy.md)).
- Short retention, access control and auditing. No alert promises an intervention for a person.
