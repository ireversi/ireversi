const fs = require('fs');
const path = require('path');
const NodeEnvironment = require('jest-environment-node');

const globalConfigPath = path.resolve(__dirname, 'globalConfig.json');

module.exports = class MongoEnvironment extends NodeEnvironment {
  // eslint-disable-next-line no-useless-constructor
  constructor(config) {
    console.log(21);
    super(config);
  }

  async setup() {
    // eslint-disable-next-line no-console
    console.log('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName;

    await super.setup();
  }

  async teardown() {
    // eslint-disable-next-line no-console
    console.log('Teardown MongoDB Test Environment');

    await super.teardown();
  }

  runScript(script) {
    // console.log(22);
    return super.runScript(script);
  }
};
