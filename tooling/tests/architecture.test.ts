import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { root, ruleIds } from './support/eslint.ts';

const fixtures = join(root, 'tooling/fixtures/architecture');
const eslint = new ESLint({ cwd: root, overrideConfigFile: 'eslint.architecture.config.js' });

const domainFile = 'packages/domain/src/tracking/domain/entry.ts';
const applicationFile = 'packages/domain/src/tracking/application/record-entry.ts';
const otherContextFile = 'packages/domain/src/insights/application/summary.ts';
const sharedFile = 'packages/domain/src/shared/value.ts';
const appFile = 'apps/mobile/src/tracking/infrastructure/search.ts';

async function lintFixture(fixture: string, virtualPath: string): Promise<string[]> {
  return ruleIds(eslint, readFileSync(join(fixtures, fixture), 'utf8'), virtualPath);
}

describe('architecture:check — packages/domain stays pure (FR-003, FR-012)', () => {
  it.each([
    ['domain-imports-react.ts', 'no-restricted-imports'],
    ['domain-imports-expo.ts', 'no-restricted-imports'],
    ['domain-imports-sqlite.ts', 'no-restricted-imports'],
    ['domain-calls-fetch.ts', 'no-restricted-globals'],
    ['domain-calls-date-now.ts', 'no-restricted-properties'],
    ['domain-creates-current-date.ts', 'no-restricted-syntax'],
    ['domain-calls-math-random.ts', 'no-restricted-properties'],
    ['domain-calls-random-uuid.ts', 'no-restricted-properties'],
    ['imports-lab-scope.ts', 'no-restricted-imports'],
    ['imports-lab-folder.ts', 'no-restricted-imports'],
  ])('%s fails with %s', async (fixture, rule) => {
    expect(await lintFixture(fixture, domainFile)).toContain(rule);
  });
});

describe('architecture:check — layers and bounded contexts (principle V)', () => {
  it('fails when a domain/ folder imports application/', async () => {
    const rules = await lintFixture('domain-layer-imports-application.ts', domainFile);
    expect(rules).toContain('no-restricted-imports');
  });

  it('fails when an application/ folder imports an adapter under apps/', async () => {
    const rules = await lintFixture('application-layer-imports-adapter.ts', applicationFile);
    expect(rules).toContain('no-restricted-imports');
  });

  it("fails when a context imports another context's domain/", async () => {
    const rules = await lintFixture('context-imports-other-domain.ts', otherContextFile);
    expect(rules).toContain('no-restricted-imports');
  });

  it('fails when shared/ imports a context', async () => {
    const rules = await lintFixture('shared-imports-context.ts', sharedFile);
    expect(rules).toContain('no-restricted-imports');
  });

  it('passes a clean domain file', async () => {
    expect(await lintFixture('clean-domain.ts', domainFile)).toEqual([]);
  });

  it("passes a context that uses another context's application API", async () => {
    expect(await lintFixture('context-uses-application-api.ts', otherContextFile)).toEqual([]);
  });
});

describe('architecture:check — the app never imports the AI lab (ADR-030)', () => {
  it.each(['imports-lab-scope.ts', 'imports-lab-folder.ts'])('%s fails', async (fixture) => {
    expect(await lintFixture(fixture, appFile)).toContain('no-restricted-imports');
  });
});
