const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const globalConfigPath = path.resolve(__dirname, 'globalConfig.json');
const mongod = new MongoMemoryServer({
  autoStart: false,
});

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: 'ireversi',
    mongoUri: await mongod.getConnectionString(),
  };

  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  global.__MONGOD__ = mongod;
  // process.env.MONGO_URL = mongoConfig.mongoUri;
};
