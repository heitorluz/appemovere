import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { emailFromIdent, isNoReplyEmail } from '../checks/author.ts';
import { root } from './support/eslint.ts';
import { createRepository, removeRepository, runScript } from './support/repository.ts';

const script = join(root, 'tooling/checks/author.ts');

describe('isNoReplyEmail (FR-023, plan Model)', () => {
  it.each([
    '12345+synthetic-person@users.noreply.github.com',
    'synthetic-person@users.noreply.github.com',
  ])('accepts %s', (email) => {
    expect(isNoReplyEmail(email)).toBe(true);
  });

  it.each([
    'synthetic@example.invalid',
    'synthetic@users.noreply.github.com.example.invalid',
    '12345+synthetic@users.noreply.github.co',
    '+synthetic@users.noreply.github.com',
    'synthetic_person@users.noreply.github.com',
    '',
  ])('rejects %s', (email) => {
    expect(isNoReplyEmail(email)).toBe(false);
  });
});

describe('emailFromIdent', () => {
  it('reads the email from git var GIT_AUTHOR_IDENT', () => {
    const ident = 'Synthetic Person <1+synthetic@users.noreply.github.com> 1700000000 +0000';
    expect(emailFromIdent(ident)).toBe('1+synthetic@users.noreply.github.com');
  });
});

describe('author.ts in a repository', () => {
  let repository: string;

  beforeEach(() => {
    repository = createRepository();
  });

  afterEach(() => {
    removeRepository(repository);
  });

  it('passes a no-reply author', () => {
    expect(runScript(script, [], { cwd: repository }).status).toBe(0);
  });

  it('refuses any other author email and names the rule', () => {
    const result = runScript(script, [], {
      cwd: repository,
      env: { GIT_AUTHOR_EMAIL: 'synthetic@example.invalid' },
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('leaks/author-email');
  });
});
