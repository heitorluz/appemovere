import { execFileSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { listStagedFiles, listTrackedFiles, repositoryRoot } from '../lib/git.ts';

let repository: string;

function git(...args: string[]): void {
  execFileSync('git', args, { cwd: repository, stdio: 'ignore' });
}

beforeEach(() => {
  repository = realpathSync(mkdtempSync(join(tmpdir(), 'emovere-git-')));
  git('init', '--quiet');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Test');
  writeFileSync(join(repository, 'tracked.ts'), 'export {};\n');
  git('add', 'tracked.ts');
  git('commit', '--quiet', '-m', 'test: synthetic commit');
});

afterEach(() => {
  rmSync(repository, { recursive: true, force: true });
});

describe('repositoryRoot', () => {
  it('returns the top-level folder of the repository', () => {
    expect(repositoryRoot(repository)).toBe(repository);
  });
});

describe('listTrackedFiles', () => {
  it('lists committed files and ignores untracked ones', () => {
    writeFileSync(join(repository, 'untracked.ts'), 'export {};\n');

    expect(listTrackedFiles(repository)).toEqual(['tracked.ts']);
  });
});

describe('listStagedFiles', () => {
  it('lists added and modified files, including names with spaces', () => {
    writeFileSync(join(repository, 'tracked.ts'), 'export const changed = 1;\n');
    writeFileSync(join(repository, 'new file.ts'), 'export {};\n');
    git('add', 'tracked.ts', 'new file.ts');

    expect(listStagedFiles(repository).sort()).toEqual(['new file.ts', 'tracked.ts']);
  });

  it('leaves out deleted files', () => {
    git('rm', '--quiet', 'tracked.ts');

    expect(listStagedFiles(repository)).toEqual([]);
  });
});
