import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(svg)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },

  // Test spec file resolution pattern
  // Matches filename that contains .test.
  testRegex: '\\.test\\.tsx?$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/testUtils/setupTests.ts'],

  transformIgnorePatterns: [
    'node_modules/(?!d3-interpolate|d3-color|react-monaco-editor|openshift-assisted-ui-lib|@patternfly/react-tokens|@patternfly-labs/react-form-wizard|@juggle/resize-observer|@react-hook/*|uuid|@openshift-console/dynamic-plugin-sdk*|screenfull)',
  ],
};

export default config;
