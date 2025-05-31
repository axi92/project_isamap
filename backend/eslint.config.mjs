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
  // JavaScript and TypeScript base config
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
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
      'prettier/prettier': 'error',
    },
    ignores: ['dist/', 'node_modules/'],
  },
  // TypeScript recommended rules
  ...tseslint.configs.recommended,
  // Import plugin recommended rules
  ...compat.extends('plugin:import/recommended', 'plugin:import/typescript'),
  // Prettier recommended rules
  ...compat.extends('prettier'),
]);