import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  findBlockedHeader,
  findBlockedPath,
  gitignorePatterns,
  loadRules,
} from '../checks/data-files.ts';
import { root } from './support/eslint.ts';
import { createRepository, git, removeRepository, runScript } from './support/repository.ts';

const rules = loadRules();
const script = join(root, 'tooling/checks/data-files.ts');
const sqliteHeader = Buffer.from('SQLite format 3\0', 'latin1');

describe('data-file rules (plan Model)', () => {
  it('holds exactly the Model values', () => {
    expect(rules).toEqual({
      blockedExtensions: [
        '.db',
        '.sqlite',
        '.sqlite3',
        '.realm',
        '.enc',
        '.emovere-export',
        '.pem',
        '.key',
        '*.db-*',
        '*.sqlite-*',
      ],
      blockedNames: ['.env', '.env.*', '!.env.example'],
      blockedFolders: ['exports/'],
      blockedHeaders: [{ name: 'SQLite', bytes: 'SQLite format 3\0' }],
    });
  });

  it('matches the database, export and secret sections of .gitignore', () => {
    const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');
    const sections = gitignore
      .split(/\n\s*\n/)
      .filter((block) => /^# (Real data|Secrets)/.test(block));
    const patterns = sections.flatMap((block) =>
      block.split('\n').filter((line) => line.length > 0 && !line.startsWith('#')),
    );
    expect(new Set(patterns)).toEqual(new Set(gitignorePatterns(rules)));
  });
});

describe('findBlockedPath (FR-015)', () => {
  it.each([
    'journal.db',
    'apps/mobile/data/journal.sqlite',
    'backup.sqlite3',
    'store.realm',
    'vault.enc',
    'march.emovere-export',
    'certs/server.pem',
    'certs/server.key',
    'JOURNAL.DB',
    'journal.db-wal',
    'journal.sqlite-shm',
    '.env',
    'apps/mobile/.env.local',
    'exports/entries.json',
    'apps/mobile/exports/notes.csv',
  ])('blocks %s', (path) => {
    expect(findBlockedPath(path, rules)?.path).toBe(path);
  });

  it.each([
    '.env.example',
    'packages/domain/src/index.ts',
    'apps/mobile/assets/icon.png',
    'tooling/lib/db.ts',
    'keyboard.ts',
    'src/exporter.ts',
    'exports.ts',
    'docs/product/09-architecture.md',
  ])('allows %s', (path) => {
    expect(findBlockedPath(path, rules)).toBeUndefined();
  });
});

describe('findBlockedHeader (FR-015)', () => {
  it('blocks a file that starts with the SQLite header, whatever its extension', () => {
    const head = Buffer.concat([sqliteHeader, Buffer.from('synthetic')]);
    expect(findBlockedHeader('notes.txt', head, rules)?.rule).toBe('leaks/database-header');
  });

  it('allows a file without the header', () => {
    expect(findBlockedHeader('notes.txt', Buffer.from('synthetic notes'), rules)).toBeUndefined();
  });
});

describe('data-files.ts in a repository (plan Contract)', () => {
  let repository: string;

  beforeEach(() => {
    repository = createRepository();
    writeFileSync(join(repository, '.gitignore'), '*.sqlite\n');
    writeFileSync(join(repository, 'clean.ts'), 'export {};\n');
  });

  afterEach(() => {
    removeRepository(repository);
  });

  it('passes a clean staged change', () => {
    git(repository, 'add', 'clean.ts');
    expect(runScript(script, ['--staged'], { cwd: repository }).status).toBe(0);
  });

  it('refuses force-added and disguised database files that are staged', () => {
    writeFileSync(join(repository, 'journal.sqlite'), sqliteHeader);
    writeFileSync(join(repository, 'notes.bin'), sqliteHeader);
    git(repository, 'add', '--force', 'journal.sqlite', 'notes.bin', 'clean.ts');

    const result = runScript(script, ['--staged'], { cwd: repository });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('journal.sqlite leaks/blocked-extension');
    expect(result.stdout).toContain('notes.bin leaks/database-header');
  });

  it('refuses tracked database files when run over all tracked files', () => {
    writeFileSync(join(repository, 'notes.bin'), sqliteHeader);
    git(repository, 'add', 'notes.bin', 'clean.ts');
    git(repository, 'commit', '--quiet', '-m', 'test: synthetic commit');

    const result = runScript(script, [], { cwd: repository });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('notes.bin leaks/database-header');
  });
});
