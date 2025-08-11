module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-prefer-arrow',
    'eslint-plugin-simple-import-sort',
  ],
  extends: [
    '@nestjs/eslint-config',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'build/', '*.js'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-triple-slash-reference': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/promise-function-async': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
    '@typescript-eslint/unbound-method': 'warn',

    // Import rules
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/order': 'off', // Use simple-import-sort instead
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // General rules
    'prefer-arrow/prefer-arrow-functions': [
      'warn',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'prefer-arrow-callback': 'warn',
    'arrow-body-style': 'off',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'sort-imports': 'off', // Use simple-import-sort instead

    // JSDoc rules
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'error',
    'jsdoc/check-line-alignment': 'error',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-property-names': 'error',
    'jsdoc/check-syntax': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/check-values': 'error',
    'jsdoc/empty-tags': 'error',
    'jsdoc/implements-on-classes': 'error',
    'jsdoc/match-description': 'warn',
    'jsdoc/newline-after-description': 'error',
    'jsdoc/no-bad-blocks': 'error',
    'jsdoc/no-defaults': 'warn',
    'jsdoc/no-undefined-types': 'warn',
    'jsdoc/require-description': 'warn',
    'jsdoc/require-description-complete-sentence': 'warn',
    'jsdoc/require-example': 'off',
    'jsdoc/require-file-overview': 'off',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-jsdoc': [
      'warn',
      {
        publicOnly: true,
        require: {
          ArrowFunctionExpression: false,
          ClassDeclaration: true,
          ClassExpression: false,
          FunctionDeclaration: true,
          FunctionExpression: false,
          MethodDefinition: true,
        },
        contexts: [
          'ExportNamedDeclaration',
          'ExportDefaultDeclaration',
          'ExportAllDeclaration',
        ],
      },
    ],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'error',

    // NestJS specific rules
    'class-methods-use-this': 'off', // NestJS services often don't use 'this'
    'max-classes-per-file': 'off', // NestJS modules can have multiple classes
    'no-empty-function': 'off', // NestJS lifecycle hooks can be empty
    'prefer-arrow-callback': 'off', // NestJS uses function declarations
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off',
      },
    },
    {
      files: ['src/database/migrations/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off',
        'prefer-const': 'off',
      },
    },
  ],
};
