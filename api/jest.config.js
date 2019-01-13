require('dotenv').config();

const jestIgnore = process.env.JEST_IGNORE ? process.env.JEST_IGNORE.split(',') : [];

module.exports = {
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['<rootDir>/tests', '<rootDir>/src/utils/db.js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/tests/config.js',
  testEnvironment: 'node',
  testPathIgnorePatterns: jestIgnore,
  transform: {}, // Disable .babelrc
};
