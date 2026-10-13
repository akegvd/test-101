import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'reports', '.stryker-tmp', 'public/mockServiceWorker.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['lessons/**/*.test.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },
  {
    files: ['lessons/**/*.test.{ts,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      // `test` at the top level, `it` inside `describe` (see lesson 00)
      'vitest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
    },
  },
  {
    // "Bad" example tests are bad on purpose. The lesson README explains each problem.
    files: ['lessons/**/*.bad.test.{ts,tsx}'],
    rules: {
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
      'vitest/valid-title': 'off',
    },
  },
);
