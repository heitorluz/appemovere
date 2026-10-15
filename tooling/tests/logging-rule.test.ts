import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { root, ruleIds } from './support/eslint.ts';

const fixtures = join(root, 'tooling/fixtures/logging');
const eslint = new ESLint({ cwd: root });
const paths = ['apps/mobile/src/tracking/save.ts', 'packages/domain/src/tracking/domain/save.ts'];

function lintFixture(fixture: string, path: string): Promise<string[]> {
  return ruleIds(eslint, readFileSync(join(fixtures, fixture), 'utf8'), path);
}

describe.each(paths)('logging rule in %s (FR-021, D6)', (path) => {
  it.each([
    ['console-log.ts', 'no-console'],
    ['console-error.ts', 'no-console'],
    ['imports-logger.ts', 'no-restricted-imports'],
  ])('%s fails with %s', async (fixture, rule) => {
    expect(await lintFixture(fixture, path)).toContain(rule);
  });

  it('passes a clean file', async () => {
    expect(await lintFixture('clean.ts', path)).toEqual([]);
  });
});
