import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { root } from './support/eslint.ts';

const folder = join(root, '.github/ISSUE_TEMPLATE');
const forms = ['bug-report.yml', 'proposal.yml'];

interface FormItem {
  readonly type: string;
  readonly attributes?: { readonly value?: string };
}

function readYaml(file: string): Record<string, unknown> {
  return parse(readFileSync(join(folder, file), 'utf8')) as Record<string, unknown>;
}

function readmeSection(heading: string): string {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const start = readme.indexOf(`## ${heading}\n`);
  const body = readme.slice(start + heading.length + 4);
  return body.slice(0, body.indexOf('\n## ')).trim();
}

describe('issue forms (FR-024)', () => {
  it('disables blank issues', () => {
    expect(readYaml('config.yml').blank_issues_enabled).toBe(false);
  });

  it('offers only the bug report and the proposal', () => {
    expect(readdirSync(folder).sort()).toEqual(['bug-report.yml', 'config.yml', 'proposal.yml']);
  });

  it.each(forms)('%s opens with the warning and the crisis text before any field', (form) => {
    const [first] = readYaml(form).body as FormItem[];
    const text = first?.attributes?.value ?? '';

    expect(first?.type).toBe('markdown');
    expect(text).toMatch(/never paste real content/i);
    expect(text).toContain(readmeSection('If you are in crisis'));
  });
});
