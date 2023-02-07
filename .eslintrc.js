module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: '2020',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.tests.json'],
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  rules: {
    eqeqeq: ['error', 'always'],
    indent: 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      // Allowing for React components definitions
      {
        selector: 'function',
        format: ['PascalCase', 'camelCase'],
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          '{}': {
            message: 'Use Record<string, unknown> instead',
            fixWith: 'Record<string, unknown>',
          },
        },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: 'Please use lodash/module instead.',
          },
          {
            name: 'react-i18next',
            importNames: ['useTranslation'],
            message: 'Please use useTranslation from src/hooks/useTranslation.ts instead',
          },
          {
            name: '@openshift-console/dynamic-plugin-sdk',
            importNames: ['useK8sWatchResource'],
            message: 'Please use a type friendly wrapper from src/hooks/k8s.ts instead',
          },
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        fixToUnknown: true,
      },
    ],
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/self-closing-comp': 'error',
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    '.eslintrc.js',
    'src/components/ClusterTemplatesPage/HelmRepositoriesTab.test.tsx',
    'src/components/ClusterTemplatesPage/ClusterTemplatesTab.test.tsx',
    'src/components/ClusterTemplatesPage/ClusterTemplatesPage.test.tsx',
    'src/components/ClusterTemplateWizard/Steps/ManageQuotasStep/ManageQuotasStep.test.tsx',
    'src/components/ClusterTemplateDetailsPage/UsageSection.test.tsx',
    'src/components/ClusterTemplateDetailsPage/QuotasSection.test.tsx',
    'src/components/ClusterTemplateDetailsPage/ClusterTemplateDetailsPage.test.tsx',
  ],
};
