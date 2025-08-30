import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { defineConfig } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL('.', import.meta.url)),
});

export default defineConfig([
  {
    ignores: ['dist/', 'node_modules/', 'src/coverage/', 'eslint.config.mjs', 'jest.config.js'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // adjust if tsconfig is in ./backend/
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Enforce single quotes
      quotes: ['error', 'single'],
      // Allow only relative imports
      'import/no-absolute-path': 'error',
      'import/no-unresolved': 'off', // handled by TS
      // Prettier integration (optional)
      'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'lf' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // Block deep relative imports into src/
            './src/*',
            '../src/*',
            '../../src/*',
            // Block any relative path going deep
            '../*',
            '../../*',
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          // This makes ESLint use your tsconfig paths
          project: './tsconfig.json',
        },
      },
    },
  },
  // TypeScript recommended rules
  ...tseslint.configs.recommended,
  // Import plugin recommended rules
  ...compat.extends('plugin:import/recommended', 'plugin:import/typescript'),
  // Prettier recommended rules
  ...compat.extends('prettier'),
]);
