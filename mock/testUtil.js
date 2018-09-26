const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const rewriter = jsonServer.rewriter(require('./routes.template.js'));
const template = JSON.stringify(require('./db.template.js'));

const middlewares = jsonServer.defaults();
const PORT = process.env.MOCK_DB_PORT;
const testFile = path.join(__dirname, 'test.json');
let server;

module.exports = {
  async getDB() {
    return JSON.parse(await promisify(fs.readFile)(testFile, 'utf8'));
  },
  async prepareMock() {
    fs.writeFileSync(testFile, template, 'utf8');

    const app = jsonServer.create();
    app.use(middlewares);
    app.use(rewriter);
    app.use(jsonServer.router(testFile));
    await new Promise((resolve, reject) => {
      server = app.listen(PORT, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
  async deleteMock() {
    fs.unlinkSync(testFile);
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};
