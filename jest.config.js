module.exports = {
  globalSetup: '<rootDir>/tests/build.js',
  globalTeardown: '<rootDir>/tests/teardown.js',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/api'],
};
