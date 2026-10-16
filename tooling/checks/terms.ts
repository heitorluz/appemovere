// Term linter (FR-014; plan Model, Term list). Flags the forbidden terms of SP-04 and of the
// language table in content and translation files: whole words, any case, accents ignored.
// With file arguments it checks those files; without, every file the content globs match.
import { globSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { exitCodeFor, type Finding, formatFindings } from '../lib/findings.ts';
import { repositoryRoot } from '../lib/git.ts';

interface Term {
  readonly text: string;
  readonly source: string;
}

interface TermGroup {
  readonly id: string;
  readonly status: 'approved' | 'clinical-draft';
  readonly terms: readonly Term[];
}

export interface TermList {
  readonly contentGlobs: readonly string[];
  readonly groups: readonly TermGroup[];
}

interface Matcher {
  readonly group: string;
  readonly term: Term;
  readonly pattern: RegExp;
}

const listFile = new URL('../config/forbidden-terms.json', import.meta.url);

export function loadTermList(): TermList {
  return JSON.parse(readFileSync(listFile, 'utf8')) as TermList;
}

// Both sides are compared without accents and in lower case ("voce deve" matches "você deve").
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A word boundary is any position not between two letters or digits, so "eu" never matches
// inside "seu" or "meu".
function matcherFor(group: string, term: Term): Matcher {
  const words = normalize(term.text).split(/\s+/).map(escape).join('\\s+');
  return { group, term, pattern: new RegExp(`(?<![\\p{L}\\p{N}])${words}(?![\\p{L}\\p{N}])`, 'u') };
}

const compiled = new WeakMap<TermList, Matcher[]>();

function matchersOf(list: TermList): Matcher[] {
  const cached = compiled.get(list);
  if (cached !== undefined) return cached;
  const matchers = list.groups.flatMap((group) =>
    group.terms.map((term) => matcherFor(group.id, term)),
  );
  compiled.set(list, matchers);
  return matchers;
}

export function findTerms(path: string, content: string, list: TermList): Finding[] {
  const matchers = matchersOf(list);
  return content.split('\n').flatMap((text, index) => {
    const line = normalize(text);
    return matchers
      .filter(({ pattern }) => pattern.test(line))
      .map(({ group, term }) => ({
        path,
        line: index + 1,
        rule: `terms/${group}`,
        message: `forbidden term "${term.text}" (${term.source})`,
      }));
  });
}

export function checkTerms(files: readonly string[], cwd: string = process.cwd()): Finding[] {
  const root = repositoryRoot(cwd);
  const list = loadTermList();
  const paths =
    files.length > 0
      ? files.map((file) => relative(root, resolve(cwd, file)))
      : globSync([...list.contentGlobs], { cwd: root });
  return paths.flatMap((path) => findTerms(path, readFileSync(resolve(root, path), 'utf8'), list));
}

if (import.meta.main) {
  const findings = checkTerms(process.argv.slice(2));
  if (findings.length > 0) console.log(formatFindings(findings));
  process.exitCode = exitCodeFor(findings);
}
