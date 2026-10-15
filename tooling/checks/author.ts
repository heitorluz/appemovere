// Commit-author check (FR-023; plan Model, Commit-author rule). Refuses a commit whose author
// email is not a GitHub no-reply address.
import { execFileSync } from 'node:child_process';

import { exitCodeFor, type Finding, formatFindings } from '../lib/findings.ts';

const noReplyEmails = [
  /^[0-9]+\+[A-Za-z0-9-]+@users\.noreply\.github\.com$/,
  /^[A-Za-z0-9-]+@users\.noreply\.github\.com$/,
];

export function isNoReplyEmail(email: string): boolean {
  return noReplyEmails.some((pattern) => pattern.test(email));
}

export function emailFromIdent(ident: string): string {
  return /<([^>]*)>/.exec(ident)?.[1] ?? '';
}

export function checkAuthor(cwd: string = process.cwd()): Finding[] {
  const ident = execFileSync('git', ['var', 'GIT_AUTHOR_IDENT'], { cwd, encoding: 'utf8' });
  if (isNoReplyEmail(emailFromIdent(ident))) return [];
  return [
    {
      path: 'git config user.email',
      rule: 'leaks/author-email',
      message: 'commit with your GitHub no-reply address (Settings → Emails)',
    },
  ];
}

if (import.meta.main) {
  const findings = checkAuthor();
  if (findings.length > 0) console.log(formatFindings(findings));
  process.exitCode = exitCodeFor(findings);
}
