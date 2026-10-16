import { existsSync, readFileSync } from 'node:fs';
import { join, matchesGlob } from 'node:path';

import { describe, expect, it } from 'vitest';

import { findTerms, loadTermList } from '../checks/terms.ts';
import { root } from './support/eslint.ts';
import { runScript } from './support/repository.ts';

const termList = loadTermList();
const fixtures = join(root, 'tooling/fixtures/terms');
const script = join(root, 'tooling/checks/terms.ts');

function lint(fixture: string) {
  const path = join(fixtures, fixture);
  return findTerms(fixture, readFileSync(path, 'utf8'), termList);
}

function headingSlugs(file: string): string[] {
  return readFileSync(join(root, file), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('#'))
    .map((line) =>
      line
        .replace(/^#+\s*/, '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s/g, '-'),
    );
}

describe('term list (plan Model, FR-014)', () => {
  it('reads content files only, never docs/ or specs/', () => {
    expect(termList.contentGlobs.length).toBeGreaterThan(0);
    for (const glob of termList.contentGlobs) {
      for (const path of [
        'docs/product/02-language.md',
        'docs/a.json',
        'specs/001-bootstrap/spec.md',
      ]) {
        expect(matchesGlob(path, glob)).toBe(false);
      }
    }
  });

  it('holds the three groups with their exact terms and sources', () => {
    const groups = Object.fromEntries(termList.groups.map((group) => [group.id, group]));
    expect(Object.keys(groups).sort()).toEqual(['language-table', 'sp-04', 'sp-04-diagnosis']);
    expect(groups['sp-04']?.terms.map((term) => term.text)).toEqual([
      'piorou',
      'falhou',
      'meta não atingida',
      'você deve',
      'eu',
      'percebi',
      'estou preocupado',
    ]);
    expect(groups['language-table']?.terms.map((term) => term.text)).toEqual([
      'auxilia o seu tratamento',
      'acompanha os seus sintomas',
      'exercícios para a sua ansiedade',
      'isso causa',
      'isso vai resolver',
      'percebi que você',
      'estou preocupado com você',
      'dias seguidos',
      'dia improdutivo',
    ]);
    expect(groups['sp-04-diagnosis']).toEqual({
      id: 'sp-04-diagnosis',
      status: 'clinical-draft',
      terms: [],
    });
  });

  it.each(termList.groups)('group $id follows the field constraints', (group) => {
    expect(['approved', 'clinical-draft']).toContain(group.status);
    if (group.status === 'approved') expect(group.terms.length).toBeGreaterThan(0);
    for (const term of group.terms) {
      expect(term.text).not.toBe('');
      expect(term.text).toBe(term.text.toLowerCase());
      expect(term.source).toMatch(/^docs\/.+#.+$/);
    }
  });

  it('cites docs/ sections that exist', () => {
    const sources = new Set(
      termList.groups.flatMap((group) => group.terms.map((term) => term.source)),
    );
    for (const source of sources) {
      const [file = '', anchor = ''] = source.split('#');
      expect(existsSync(join(root, file))).toBe(true);
      expect(headingSlugs(file)).toContain(anchor);
    }
  });
});

describe('findTerms (FR-014, SC-004)', () => {
  it('flags each whole-word term, in any case and with or without accents', () => {
    const found = lint('forbidden.json').map(
      ({ line, rule, message }) => `${line} ${rule} ${message}`,
    );

    expect(found).toEqual([
      expect.stringMatching(/^3 terms\/sp-04 .*"você deve"/),
      expect.stringMatching(/^4 terms\/sp-04 .*"você deve"/),
      expect.stringMatching(/^5 terms\/sp-04 .*"piorou"/),
      expect.stringMatching(/^6 terms\/sp-04 .*"meta não atingida"/),
      expect.stringMatching(/^7 terms\/sp-04 .*"eu"/),
      expect.stringMatching(/^7 terms\/sp-04 .*"percebi"/),
    ]);
  });

  it('reports file, line, term and group', () => {
    const [first] = lint('forbidden.json');
    expect(first).toMatchObject({ path: 'forbidden.json', line: 3, rule: 'terms/sp-04' });
    expect(first?.message).toContain('docs/product/07-clinical-safety.md#acceptance-criteria-sp');
  });

  it('never flags a term inside a longer word ("eu" in "seu", "meu", "europeu")', () => {
    expect(lint('clean.json')).toEqual([]);
  });
});

describe('terms.ts', () => {
  it('fails on the given files and names each finding', () => {
    const result = runScript(script, [join(fixtures, 'forbidden.json')], { cwd: root });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('tooling/fixtures/terms/forbidden.json:3 terms/sp-04');
  });

  it('passes clean files', () => {
    expect(runScript(script, [join(fixtures, 'clean.json')], { cwd: root }).status).toBe(0);
  });

  it('checks every content file when no file is given', () => {
    expect(runScript(script, [], { cwd: root }).status).toBe(0);
  });
});
