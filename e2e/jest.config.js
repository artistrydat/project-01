module.exports = {
  rootDir: '..',
  preset: 'react-native',
  testRunner: 'jest-circus/runner',
  setupFilesAfterEnv: ['<rootDir>/e2e/init.js'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};