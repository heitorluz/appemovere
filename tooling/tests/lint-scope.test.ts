import { join } from 'node:path';

import { ESLint } from 'eslint';
import * as prettier from 'prettier';
import { describe, expect, it } from 'vitest';

import { root, ruleIds } from './support/eslint.ts';

const eslint = new ESLint({ cwd: root });
const prettierIgnore = [join(root, '.prettierignore'), join(root, '.gitignore')];

const excluded = [
  'README.md',
  'docs/product/09-architecture.md',
  'specs/001-bootstrap/plan.md',
  '.specify/memory/constitution.md',
  '.specify/init-options.json',
  '.claude/skills/speckit-plan/SKILL.md',
  '.agents/skills/speckit-plan/SKILL.md',
  '.claude/skills/speckit-sample/config.json',
  '.agents/skills/speckit-sample/config.yml',
  'tooling/fixtures/architecture/clean-domain.ts',
];

const checked = [
  { path: 'packages/domain/src/sample.ts', source: 'debugger;\n', rule: 'no-debugger' },
  { path: 'apps/mobile/sample.json', source: '{"a": 1, "a": 2}\n', rule: 'json/no-duplicate-keys' },
  {
    path: '.github/workflows/sample.yml',
    source: 'on:\njobs: {}\n',
    rule: 'yml/no-empty-mapping-value',
  },
];

const unformatted = [
  { path: 'packages/domain/src/sample.ts', source: 'export const a={b:1}\n' },
  { path: 'apps/mobile/sample.json', source: '{"a":1,\n"b":2}\n' },
  { path: '.github/workflows/sample.yml', source: 'a:   1\n' },
];

function lintRules(path: string, source: string): Promise<string[]> {
  return ruleIds(eslint, source, path);
}

async function prettierIgnores(path: string): Promise<boolean> {
  const info = await prettier.getFileInfo(join(root, path), { ignorePath: prettierIgnore });
  return info.ignored;
}

async function isFormatted(path: string, source: string): Promise<boolean> {
  const filepath = join(root, path);
  const options = await prettier.resolveConfig(filepath);
  return prettier.check(source, { ...options, filepath });
}

describe('lint and format:check scope (FR-010a)', () => {
  it.each(excluded)('ESLint ignores %s', async (path) => {
    expect(await eslint.isPathIgnored(join(root, path))).toBe(true);
  });

  it.each(excluded)('Prettier ignores %s', async (path) => {
    expect(await prettierIgnores(path)).toBe(true);
  });

  it.each(checked)('ESLint checks $path', async ({ path, source, rule }) => {
    expect(await lintRules(path, source)).toContain(rule);
  });

  it.each(unformatted)('Prettier checks $path', async ({ path, source }) => {
    expect(await prettierIgnores(path)).toBe(false);
    expect(await isFormatted(path, source)).toBe(false);
  });
});

function functionWithBranches(branches: number): string {
  const body = Array.from({ length: branches }, (_, i) => `  if (value === ${i}) return ${i};`);
  return ['export function pick(value: number): number {', ...body, '  return -1;', '}', ''].join(
    '\n',
  );
}

function functionWithLines(lines: number): string {
  const body = Array.from({ length: lines - 2 }, (_, i) => `  const v${i} = ${i};`);
  return ['export function long(): void {', ...body, '}', ''].join('\n');
}

function fileWithLines(lines: number): string {
  return Array.from({ length: lines }, (_, i) => `export const v${i} = ${i};`).join('\n') + '\n';
}

function functionWithParams(count: number): string {
  const params = Array.from({ length: count }, (_, i) => `p${i}: number`).join(', ');
  return `export function many(${params}): number {\n  return 0;\n}\n`;
}

function functionWithDepth(depth: number): string {
  const open = Array.from({ length: depth }, (_, i) => `${'  '.repeat(i + 1)}if (v > ${i}) {`);
  const close = Array.from({ length: depth }, (_, i) => `${'  '.repeat(depth - i)}}`);
  return ['export function deep(v: number): void {', ...open, ...close, '}', ''].join('\n');
}

const limits = [
  { rule: 'complexity', build: functionWithBranches, atLimit: 9 },
  { rule: 'max-lines-per-function', build: functionWithLines, atLimit: 50 },
  { rule: 'max-lines', build: fileWithLines, atLimit: 300 },
  { rule: 'max-params', build: functionWithParams, atLimit: 3 },
  { rule: 'max-depth', build: functionWithDepth, atLimit: 3 },
];

describe('Clean Code limits (FR-010b, plan Model)', () => {
  const paths = ['packages/domain/src/sample.ts', 'apps/mobile/src/sample.ts'];

  describe.each(paths)('in %s', (path) => {
    it.each(limits)('$rule passes at the limit', async ({ rule, build, atLimit }) => {
      expect(await lintRules(path, build(atLimit))).not.toContain(rule);
    });

    it.each(limits)('$rule fails one above the limit', async ({ rule, build, atLimit }) => {
      expect(await lintRules(path, build(atLimit + 1))).toContain(rule);
    });
  });

  it('exempts test files from max-lines-per-function', async () => {
    const rules = await lintRules('packages/domain/tests/sample.test.ts', functionWithLines(51));
    expect(rules).not.toContain('max-lines-per-function');
  });
});
