import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { listStagedFiles, listTrackedFiles, repositoryRoot } from '../lib/git.ts';
import { createRepository, git, removeRepository } from './support/repository.ts';

let repository: string;

beforeEach(() => {
  repository = createRepository();
  writeFileSync(join(repository, 'tracked.ts'), 'export {};\n');
  git(repository, 'add', 'tracked.ts');
  git(repository, 'commit', '--quiet', '-m', 'test: synthetic commit');
});

afterEach(() => {
  removeRepository(repository);
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
    git(repository, 'add', 'tracked.ts', 'new file.ts');

    expect(listStagedFiles(repository).sort()).toEqual(['new file.ts', 'tracked.ts']);
  });

  it('leaves out deleted files', () => {
    git(repository, 'rm', '--quiet', 'tracked.ts');

    expect(listStagedFiles(repository)).toEqual([]);
  });
});
