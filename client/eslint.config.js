// eslint.config.js
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // ✅ Base JS config
  js.configs.recommended,

  // ✅ Vue 3 + Flat config
  ...vue.configs['flat/recommended'],

  // ✅ TypeScript + Vue SFC support
  {
    files: ['**/*.ts', '**/*.vue', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        parser: tsParser,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        projectService: true, // ✅ handles TS project references automatically
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        Image: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      vue,
    },
    rules: {
      // ---- Vue rules ----
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // ---- Vue template rules ----
      'vue/no-unused-components': 'warn', // warn if components are declared but not used
      'vue/no-unused-vars': 'warn', // warn for unused props / refs
      'vue/attributes-order': ['error', { order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'OTHER_ATTR', 'EVENTS', 'CONTENT'] }],
      'vue/no-multiple-template-root': 'off', // Vue 3 allows multiple root nodes
      'vue/attribute-hyphenation': 'off',

      // ---- TypeScript rules ----
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  prettier,
];
