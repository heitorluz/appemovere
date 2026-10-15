import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import * as domain from '../src/index.ts';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(packageRoot, 'src');
const importSpecifier =
  /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g;

function sourceFiles(folder: string): string[] {
  return readdirSync(folder, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => join(entry.parentPath, entry.name));
}

function importsOf(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(importSpecifier)].map((match) => match[1] ?? match[2] ?? '');
}

function staysInsidePackage(file: string, specifier: string): boolean {
  if (!specifier.startsWith('.')) return false;
  return !relative(packageRoot, resolve(dirname(file), specifier)).startsWith('..');
}

describe('packages/domain (FR-003, FR-004)', () => {
  it('loads its entry point', () => {
    expect(domain).toBeTypeOf('object');
  });

  it('imports nothing outside the package', () => {
    const outside = sourceFiles(sourceRoot).flatMap((file) =>
      importsOf(file).filter((specifier) => !staysInsidePackage(file, specifier)),
    );
    expect(outside).toEqual([]);
  });
});
