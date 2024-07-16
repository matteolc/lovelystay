/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFiles: ['./jest.setup.js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^\\~/(.*)\\.js$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['node_modules/*'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/.*\\.integration\\.spec\\.ts$',
  ],
};
