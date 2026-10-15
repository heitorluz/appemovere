import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { root } from './support/eslint.ts';
import { createRepository, git, removeRepository, runScript } from './support/repository.ts';

const script = join(root, 'tooling/checks/leaks.ts');

// Built at runtime so no token-shaped string is ever tracked (FR-015).
const fakeToken = ['ghp', '_', 'S'.repeat(20), 'y'.repeat(16)].join('');

describe('leaks:check (FR-015, FR-020; plan D9)', () => {
  let repository: string;

  beforeEach(() => {
    repository = createRepository();
    writeFileSync(join(repository, 'clean.ts'), 'export const greeting = "synthetic";\n');
  });

  afterEach(() => {
    removeRepository(repository);
  });

  it('passes a clean staged change', () => {
    git(repository, 'add', 'clean.ts');
    expect(runScript(script, ['--staged'], { cwd: repository }).status).toBe(0);
  });

  it('refuses a staged secret and names the file', () => {
    writeFileSync(join(repository, 'settings.ts'), `export const token = '${fakeToken}';\n`);
    git(repository, 'add', 'clean.ts', 'settings.ts');

    const result = runScript(script, ['--staged'], { cwd: repository });

    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/^settings\.ts:1 secretlint\//m);
    expect(result.stdout).not.toContain(fakeToken);
  });

  it('refuses a staged database file through the data-file check', () => {
    writeFileSync(join(repository, 'journal.db'), 'synthetic');
    git(repository, 'add', 'journal.db');

    const result = runScript(script, ['--staged'], { cwd: repository });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('journal.db leaks/blocked-extension');
  });

  it('checks every tracked file without --staged', () => {
    writeFileSync(join(repository, 'settings.ts'), `export const token = '${fakeToken}';\n`);
    git(repository, 'add', 'settings.ts');
    git(repository, 'commit', '--quiet', '-m', 'test: synthetic commit');

    expect(runScript(script, [], { cwd: repository }).status).toBe(1);
  });
});
