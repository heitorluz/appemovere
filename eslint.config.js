// Lint gate (FR-010a, FR-010b; plan D5, D18). Covers code and configuration only.
import js from '@eslint/js';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import yml from 'eslint-plugin-yml';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Paths outside the lint scope (FR-010a): prose, Spec Kit output and test fixtures.
export const outOfScope = [
  '**/*.md',
  'docs/**',
  'specs/**',
  '.specify/**',
  '.claude/skills/speckit-*/**',
  '.agents/skills/speckit-*/**',
  'tooling/fixtures/**',
  'pnpm-lock.yaml',
  '**/node_modules/**',
  '**/.expo/**',
  '**/coverage/**',
  '**/dist/**',
  '**/build/**',
];

const codeFiles = ['**/*.{js,mjs,cjs,ts,mts,cts,tsx}'];
const testFiles = ['**/*.test.{ts,tsx}', '**/tests/**', '**/__tests__/**'];

// Clean Code limits of the constitution (Technical Constraints and Stack; plan Model).
const cleanCode = {
  complexity: ['error', { max: 10 }],
  'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
  'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
  'max-params': ['error', { max: 3 }],
  'max-depth': ['error', { max: 3 }],
};

export default defineConfig(
  { ignores: outOfScope },
  {
    files: codeFiles,
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['packages/domain/**/*.{ts,tsx}', 'apps/mobile/**/*.{ts,tsx}'],
    rules: cleanCode,
  },
  {
    files: testFiles.map((pattern) => `{packages/domain,apps/mobile}/${pattern}`),
    rules: { 'max-lines-per-function': 'off' },
  },
  {
    files: ['**/tsconfig*.json'],
    plugins: { json },
    language: 'json/jsonc',
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.json'],
    ignores: ['**/tsconfig*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
  },
  yml.configs.recommended,
);
