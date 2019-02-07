require('dotenv').config();

module.exports = {
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['<rootDir>/tests', '<rootDir>/utils/db.js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/tests/config.js',
  testEnvironment: 'node',
  transform: {}, // Disable .babelrc
};
