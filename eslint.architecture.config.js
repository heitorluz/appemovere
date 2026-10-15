// Architecture gate (FR-012; plan D7; constitution, principle V; ADR-030).
// Run by `pnpm architecture:check`. The rules apply to folders that may not exist yet,
// so they pass on the empty case and bind every future bounded context.
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import { outOfScope } from './eslint.config.js';

const domainRoot = 'packages/domain';
const contexts = `${domainRoot}/src/*`;
const sharedKernel = `${domainRoot}/src/shared`;

// ADR-030: the app never imports the AI lab. The scope is reserved for the lab's packages;
// the names are its folders (docs/product/09-architecture.md).
const aiLab = {
  group: [
    '@emovere-lab/*',
    'rag',
    'rag/*',
    'revisor',
    'revisor/*',
    'evals',
    'evals/*',
    'simulation',
    'simulation/*',
  ],
  message: 'The app never imports the AI lab (ADR-030).',
};

// FR-003: the domain has no UI, framework, database, network, clock or identifier library.
const impureLibraries = {
  group: [
    'react',
    'react/*',
    'react-*',
    'react-native',
    'react-native/*',
    'react-native-*',
    '@react-native/*',
    'expo',
    'expo/*',
    'expo-*',
    '@expo/*',
    'sqlite3',
    'better-sqlite3',
    '@op-engineering/*',
    'drizzle-orm',
    'drizzle-orm/*',
    'axios',
    'ky',
    'node-fetch',
    'undici',
    'uuid',
    'nanoid',
    'node:*',
    'fs',
    'http',
    'https',
    'net',
    'crypto',
    'os',
    'child_process',
  ],
  message: 'packages/domain is pure TypeScript (FR-003, principle V).',
};

const toAdapters = {
  regex: '(^|/)(apps|infrastructure)(/|$)|^mobile(/|$)',
  message: 'Dependencies point inward: adapters → application → domain (principle V).',
};

const toApplication = {
  regex: '(^|/)application(/|$)',
  message: 'A domain/ folder never imports application/ (principle V).',
};

// A named segment before a layer folder means the import leaves its own context.
const toOtherContextInternals = {
  regex: '(^|/)[^./][^/]*/(domain|infrastructure)(/|$)|(^|/)[^./][^/]*/application/(?!index\\.ts$)',
  message:
    'Use another context only through its application/index.ts, never its domain/ (principle V).',
};

const toAnyContext = {
  regex: '(^|/)(domain|application|infrastructure)(/|$)',
  message: 'shared/ holds generic value objects only and imports no context (principle V).',
};

function restrictImports(...patterns) {
  return { 'no-restricted-imports': ['error', { patterns }] };
}

const domainPurity = {
  'no-restricted-globals': [
    'error',
    ...['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'].map((name) => ({
      name,
      message: 'packages/domain has no network access (FR-003).',
    })),
  ],
  'no-restricted-properties': [
    'error',
    {
      object: 'Date',
      property: 'now',
      message: 'Receive the time from a port, not the real clock (FR-003).',
    },
    { object: 'performance', property: 'now', message: 'Receive the time from a port (FR-003).' },
    { object: 'Math', property: 'random', message: 'Receive randomness from a port (FR-003).' },
    {
      object: 'crypto',
      property: 'randomUUID',
      message: 'Receive identifiers from a port (FR-003).',
    },
    {
      object: 'crypto',
      property: 'getRandomValues',
      message: 'Receive identifiers from a port (FR-003).',
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: "NewExpression[callee.name='Date'][arguments.length=0]",
      message: 'new Date() reads the real clock; receive the time from a port (FR-003).',
    },
  ],
};

export default defineConfig(
  { ignores: outOfScope },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tseslint.parser },
  },
  {
    files: ['apps/mobile/**/*.{ts,tsx}'],
    rules: restrictImports(aiLab),
  },
  {
    files: [`${domainRoot}/src/**/*.ts`],
    rules: { ...domainPurity, ...restrictImports(aiLab, impureLibraries, toAdapters) },
  },
  {
    files: [`${contexts}/domain/**/*.ts`],
    ignores: [`${sharedKernel}/**`],
    rules: restrictImports(
      aiLab,
      impureLibraries,
      toAdapters,
      toApplication,
      toOtherContextInternals,
    ),
  },
  {
    files: [`${contexts}/application/**/*.ts`],
    ignores: [`${sharedKernel}/**`],
    rules: restrictImports(aiLab, impureLibraries, toAdapters, toOtherContextInternals),
  },
  {
    files: [`${sharedKernel}/**/*.ts`],
    rules: restrictImports(aiLab, impureLibraries, toAdapters, toAnyContext),
  },
);
