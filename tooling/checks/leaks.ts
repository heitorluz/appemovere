// leaks:check (FR-015, FR-020; plan D9, Contract): the data-file check plus secretlint with
// its recommended preset, over the staged files (`--staged`) or every tracked file.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { exitCodeFor, type Finding, formatFindings } from '../lib/findings.ts';
import { listStagedFiles, listTrackedFiles, repositoryRoot } from '../lib/git.ts';
import { checkDataFiles } from './data-files.ts';

interface SecretlintResult {
  readonly filePath: string;
  readonly messages: readonly {
    readonly ruleId: string;
    readonly message: string;
    readonly loc: { readonly start: { readonly line: number } };
  }[];
}

const secretlint = fileURLToPath(new URL('../../node_modules/.bin/secretlint', import.meta.url));
const config = fileURLToPath(new URL('../../.secretlintrc.json', import.meta.url));

function toFindings(root: string, results: readonly SecretlintResult[]): Finding[] {
  return results.flatMap(({ filePath, messages }) =>
    messages.map((message) => ({
      path: filePath.startsWith(`${root}/`) ? filePath.slice(root.length + 1) : filePath,
      line: message.loc.start.line,
      rule: `secretlint/${message.ruleId}`,
      message: message.message,
    })),
  );
}

export function checkSecrets(root: string, files: readonly string[]): Finding[] {
  if (files.length === 0) return [];
  const args = ['--secretlintrc', config, '--format', 'json', '--maskSecrets', '--', ...files];
  const result = spawnSync(secretlint, args, { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (result.status !== 0 && result.status !== 1)
    throw new Error(result.stderr || 'secretlint failed');
  return toFindings(root, JSON.parse(result.stdout || '[]') as SecretlintResult[]);
}

export function checkLeaks(staged: boolean, cwd: string = process.cwd()): Finding[] {
  const root = repositoryRoot(cwd);
  const files = staged ? listStagedFiles(root) : listTrackedFiles(root);
  return [...checkDataFiles(staged, root), ...checkSecrets(root, files)];
}

if (import.meta.main) {
  const findings = checkLeaks(process.argv.includes('--staged'));
  if (findings.length > 0) console.log(formatFindings(findings));
  process.exitCode = exitCodeFor(findings);
}
