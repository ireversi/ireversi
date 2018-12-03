require('dotenv').config();

// const jestIgnore = process.env.JEST_IGNORE ? process.env.JEST_IGNORE.split(',') : [];

module.exports = {
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['<rootDir>/tests', '<rootDir>/src/utils/db.js'],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/teardown.js',
  // setupFiles: ['<rootDir>/tests/setup.js'],
  testEnvironment: '<rootDir>/tests/mongo-environment.js',

  // testEnvironment: 'node',
  // testPathIgnorePatterns: jestIgnore,
  transform: {}, // Disable .babelrc
};
