/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'airbnb', // or any other config you want to extend
    'airbnb-typescript/base',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/*.js', '**/*.cjs', '**/*.mjs'],
  rules: {
    // we can override some problematic import rules here
    // that can cause issues when using import aliases.
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    "import/order": ["error", {
      "pathGroups": [
        {
          "pattern": "@server/**",
          "group": "internal"
        },
        {
          "pattern": "@tests/**",
          "group": "internal"
        },
      ],
    }],

    // functions are always hoisted, so we can use them before they are defined
    // which in various cases improves readability
    'no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],

    'import/prefer-default-export': 'off',
  },

  overrides: [
    // TypeORM generates classes for migrations that do not use `this`.
    {
      files: ['src/database/migrations/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },

    // for TypeORM relations
    {
      files: ['src/entities/**/*.ts'],
      rules: {
        'import/no-cycle': 'off',
      },
    },
  ],
}
