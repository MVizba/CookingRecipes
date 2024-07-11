/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/no-relative-parent-imports': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            // using gitignore syntax
            group: [
              'app',
              'config',
              'database',
              'entities',
              'middleware',
              'modules',
              'trpc',
              'utils',
            ].flatMap(path => [
              `@server/${path}`,
              `@mono/server/src/${path}`,
            ]),
            message: 'Please only import from @server/shared or $mono/server/src/shared.',
          },
        ],
      },
    ]
  },
}
