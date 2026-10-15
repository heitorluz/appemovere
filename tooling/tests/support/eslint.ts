import { join } from 'node:path';

import type { ESLint } from 'eslint';

import { repositoryRoot } from '../../lib/git.ts';

export const root = repositoryRoot();

// Lints source text as if it lived at a repository path, so path-scoped rules apply.
export async function ruleIds(eslint: ESLint, source: string, path: string): Promise<string[]> {
  const [result] = await eslint.lintText(source, { filePath: join(root, path) });
  return (result?.messages ?? []).map((message) => message.ruleId ?? message.message);
}
