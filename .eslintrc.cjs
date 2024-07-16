module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  overrides: [
    {
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      files: ['src/**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint', 'import'],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/internal-regex': '^~/',
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'max-len': ['error', { code: 80 }],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_' },
        ],
        'no-process-exit': ['error'],
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
            ],
            'newlines-between': 'always',
          },
        ],
        'import/no-unresolved': 'error',
        'import/no-absolute-path': 'error',
        'import/no-self-import': 'error',
        'import/no-cycle': 'error',
        'import/no-useless-path-segments': 'error',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-deprecated': 'error',
        'import/no-extraneous-dependencies': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-commonjs': 'error',
        'import/no-amd': 'error',
        'import/first': 'error',
        'import/exports-last': 'error',
        'import/no-named-default': 'error',
        'import/no-anonymous-default-export': 'error',
        'import/group-exports': 'error',
        'import/newline-after-import': 'error',
        'import/prefer-default-export': 'off',
        'import/max-dependencies': ['error', { max: 20 }],
        'import/no-unassigned-import': 'error',
        'no-restricted-imports': 'error',
        'import/no-unused-modules': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
      },
    },
  ],
};
