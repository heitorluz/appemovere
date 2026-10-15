// Data-file check (FR-015; plan Model, Data-file rules). Blocks database, export and secret
// files by name and SQLite databases by content. `--staged` checks the index, including
// force-added files; without it, every tracked file.
import { execFileSync } from 'node:child_process';
import { closeSync, openSync, readFileSync, readSync } from 'node:fs';
import { basename, join } from 'node:path';

import { exitCodeFor, type Finding, formatFindings } from '../lib/findings.ts';
import { listStagedFiles, listTrackedFiles, repositoryRoot } from '../lib/git.ts';

export interface DataFileRules {
  readonly blockedExtensions: readonly string[];
  readonly blockedNames: readonly string[];
  readonly blockedFolders: readonly string[];
  readonly blockedHeaders: readonly { readonly name: string; readonly bytes: string }[];
}

const rulesFile = new URL('../config/data-files.json', import.meta.url);
const headerLength = 16;

export function loadRules(): DataFileRules {
  return JSON.parse(readFileSync(rulesFile, 'utf8')) as DataFileRules;
}

function globToRegExp(glob: string): RegExp {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

function matchesExtension(name: string, entry: string): boolean {
  return entry.includes('*') ? globToRegExp(entry).test(name) : name.toLowerCase().endsWith(entry);
}

function matchesName(name: string, entries: readonly string[]): boolean {
  const allowed = entries.filter((entry) => entry.startsWith('!')).map((entry) => entry.slice(1));
  const blocked = entries.filter((entry) => !entry.startsWith('!'));
  return !allowed.includes(name) && blocked.some((entry) => globToRegExp(entry).test(name));
}

function inBlockedFolder(path: string, folders: readonly string[]): boolean {
  const parents = path.split('/').slice(0, -1);
  return folders.some((folder) => parents.includes(folder.replace(/\/$/, '')));
}

export function findBlockedPath(path: string, rules: DataFileRules): Finding | undefined {
  const name = basename(path);
  if (rules.blockedExtensions.some((entry) => matchesExtension(name, entry))) {
    return {
      path,
      rule: 'leaks/blocked-extension',
      message: 'database, export or key files never enter the repository',
    };
  }
  if (matchesName(name, rules.blockedNames)) {
    return {
      path,
      rule: 'leaks/blocked-name',
      message: 'environment files never enter the repository',
    };
  }
  if (inBlockedFolder(path, rules.blockedFolders)) {
    return {
      path,
      rule: 'leaks/blocked-folder',
      message: 'exported data never enters the repository',
    };
  }
  return undefined;
}

export function findBlockedHeader(
  path: string,
  head: Buffer,
  rules: DataFileRules,
): Finding | undefined {
  const header = rules.blockedHeaders.find(({ bytes }) =>
    head.subarray(0, headerLength).equals(Buffer.from(bytes, 'latin1').subarray(0, headerLength)),
  );
  if (header === undefined) return undefined;
  return {
    path,
    rule: 'leaks/database-header',
    message: `the content is a ${header.name} database`,
  };
}

// The patterns of .gitignore that the rules stand for (invariant: the two never diverge).
export function gitignorePatterns(rules: DataFileRules): string[] {
  const extensions = rules.blockedExtensions.map((entry) =>
    entry.includes('*') ? entry : `*${entry}`,
  );
  return [...extensions, ...rules.blockedNames, ...rules.blockedFolders];
}

function readStagedHead(root: string, path: string): Buffer {
  const blob = execFileSync('git', ['cat-file', 'blob', `:${path}`], {
    cwd: root,
    maxBuffer: 1 << 30,
  });
  return blob.subarray(0, headerLength);
}

function readWorkingHead(root: string, path: string): Buffer {
  const head = Buffer.alloc(headerLength);
  const descriptor = openSync(join(root, path), 'r');
  try {
    return head.subarray(0, readSync(descriptor, head, 0, headerLength, 0));
  } finally {
    closeSync(descriptor);
  }
}

export function checkDataFiles(staged: boolean, cwd: string = process.cwd()): Finding[] {
  const root = repositoryRoot(cwd);
  const rules = loadRules();
  const paths = staged ? listStagedFiles(root) : listTrackedFiles(root);
  const readHead = staged ? readStagedHead : readWorkingHead;
  return paths.flatMap((path) => {
    const finding =
      findBlockedPath(path, rules) ?? findBlockedHeader(path, readHead(root, path), rules);
    return finding === undefined ? [] : [finding];
  });
}

if (import.meta.main) {
  const findings = checkDataFiles(process.argv.includes('--staged'));
  if (findings.length > 0) console.log(formatFindings(findings));
  process.exitCode = exitCodeFor(findings);
}
