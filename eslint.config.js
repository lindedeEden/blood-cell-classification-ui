// ESLint：TypeScript 嚴格規則 + 分層相依方向檢查（domain 不得依賴瀏覽器與上層）
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const layer = (from, banned) => ({
  files: [`src/${from}/**/*.ts`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: banned.map((b) => ({
          group: [`**/${b}/**`, `**/${b}`],
          message: `${from} 層不可依賴 ${b} 層（相依方向：domain ← data ← infra ← app ← ui ← demo ← pages）`,
        })),
      },
    ],
  },
});

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'tests/parity/golden',
      'tools/legacy-capture/**',
      'playwright-report',
      'test-results',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: '請用 ui/shared/dom.ts 的 setHtml（自動跳脫）',
        },
      ],
    },
  },
  layer('domain', ['data', 'infra', 'app', 'ui', 'demo', 'pages', 'config']),
  layer('data', ['infra', 'app', 'ui', 'demo', 'pages']),
  layer('infra', ['app', 'ui', 'demo', 'pages']),
  layer('app', ['ui', 'demo', 'pages']),
  layer('ui', ['demo', 'pages']),
  {
    files: ['src/domain/**/*.ts'],
    languageOptions: { globals: {} },
    rules: { 'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'sessionStorage'] },
  },
  { files: ['src/ui/shared/dom.ts', 'tests/**'], rules: { 'no-restricted-syntax': 'off' } },
);
