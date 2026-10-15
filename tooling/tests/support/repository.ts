import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export interface ScriptResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

// A throwaway repository with a synthetic, no-reply author; never the real one.
export function createRepository(): string {
  const repository = realpathSync(mkdtempSync(join(tmpdir(), 'emovere-repo-')));
  git(repository, 'init', '--quiet');
  git(repository, 'config', 'user.email', '1+synthetic@users.noreply.github.com');
  git(repository, 'config', 'user.name', 'Synthetic Person');
  return repository;
}

export function removeRepository(repository: string): void {
  rmSync(repository, { recursive: true, force: true });
}

export function git(repository: string, ...args: string[]): void {
  execFileSync('git', args, { cwd: repository, stdio: 'ignore' });
}

export function runScript(
  script: string,
  args: readonly string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv },
): ScriptResult {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}
