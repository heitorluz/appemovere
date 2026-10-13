import { execFileSync } from 'node:child_process';

function runGit(cwd: string, args: readonly string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' });
}

function splitNullSeparated(output: string): string[] {
  return output.split('\0').filter((path) => path.length > 0);
}

export function repositoryRoot(cwd: string = process.cwd()): string {
  return runGit(cwd, ['rev-parse', '--show-toplevel']).trim();
}

export function listTrackedFiles(cwd: string = process.cwd()): string[] {
  return splitNullSeparated(runGit(repositoryRoot(cwd), ['ls-files', '-z']));
}

export function listStagedFiles(cwd: string = process.cwd()): string[] {
  const args = ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'];
  return splitNullSeparated(runGit(repositoryRoot(cwd), args));
}
