const fs = require('fs');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const globalConfigPath = path.resolve(__dirname, 'globalConfig.json');
const mongod = new MongoMemoryServer({
  autoStart: false,
});

module.exports = async () => {
  console.log(11);
  if (!mongod.isRunning) {
    console.log(12);
    try {
      await mongod.start();
    } catch (error) {
      console.log(999, error);
    }
  }

  console.log(13);
  const mongoConfig = {
    mongoDBName: 'ireversi',
    mongoUri: await mongod.getConnectionString(),
  };

  console.log(14);
  try {
    fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
    global.__MONGOD__ = mongod;
    // process.env.MONGO_URL = mongoConfig.mongoUri;
  } catch (error) {
    console.log(15);
    console.log(error);
  }
};
