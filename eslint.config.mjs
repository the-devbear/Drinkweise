import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import reactCompiler from 'eslint-plugin-react-compiler';
import testingLibrary from 'eslint-plugin-testing-library';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.expo/**', '**/node_modules/**', '**/generated/**/*', 'ios/**', 'android/**'],
  },
  ...fixupConfigRules(
    compat.extends(
      'universe/native',
      'universe/shared/typescript-analysis',
      'plugin:@typescript-eslint/recommended'
    )
  ),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'prettier/prettier': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignorePrimitives: {
            boolean: true,
          },
        },
      ],
    },
  },
  {
    files: ['**.js'],
    rules: {
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    ...testingLibrary.configs.recommended,
  },
  reactCompiler.configs.recommended,
];
