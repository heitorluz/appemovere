import { describe, expect, it } from 'vitest';

import { exitCodeFor, formatFinding, formatFindings } from '../lib/findings.ts';

describe('formatFinding', () => {
  it('prints path, line, rule and message', () => {
    const line = formatFinding({
      path: 'apps/mobile/app/index.tsx',
      line: 12,
      rule: 'terms/forbidden',
      message: 'forbidden term "sample"',
    });

    expect(line).toBe(
      'apps/mobile/app/index.tsx:12 terms/forbidden — forbidden term "sample"',
    );
  });

  it('omits the line when the finding has none', () => {
    const line = formatFinding({
      path: 'exports/journal.emovere-export',
      rule: 'leaks/data-file',
      message: 'export files never enter the repository',
    });

    expect(line).toBe(
      'exports/journal.emovere-export leaks/data-file — export files never enter the repository',
    );
  });
});

describe('formatFindings', () => {
  it('prints one line per finding', () => {
    const output = formatFindings([
      { path: 'a.ts', line: 1, rule: 'r1', message: 'm1' },
      { path: 'b.ts', rule: 'r2', message: 'm2' },
    ]);

    expect(output).toBe('a.ts:1 r1 — m1\nb.ts r2 — m2');
  });
});

describe('exitCodeFor', () => {
  it('is 0 without findings', () => {
    expect(exitCodeFor([])).toBe(0);
  });

  it('is 1 with at least one finding', () => {
    expect(exitCodeFor([{ path: 'a.ts', rule: 'r', message: 'm' }])).toBe(1);
  });
});
