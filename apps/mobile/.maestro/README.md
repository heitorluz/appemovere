# Maestro end-to-end flows

Maestro runs the critical journeys of the app on a simulator or an emulator (FR-005). This
folder is configured, but it has no flows yet: the first ones arrive with the
`app-shell-and-help` spec ([spec plan](../../../docs/roadmap/spec-plan.md), Milestone A).

## Where flows go

- One YAML file per journey in `flows/`. [`config.yaml`](config.yaml) runs every file there.
- Flows use synthetic data from the personas only, never real content (principle II).

## Install Maestro

Maestro is a system tool, not an npm dependency. Follow the official guide at
<https://docs.maestro.dev/getting-started/installing-maestro>; it needs Java 17 or later.

## Run the flows

1. Start a development build of the app on an iOS simulator or an Android emulator.
2. From the repository root, run `pnpm --filter mobile e2e`.

CI does not run these flows yet; a job is added once flows exist (plan D11).
