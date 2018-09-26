const fs = require('fs');
const path = require('path');
const dbTemplate = require('./db.template.js');
const routesTemplate = require('./routes.template.js');

const dbFile = path.join(__dirname, 'db.json');
const routesFile = path.join(__dirname, 'routes.json');

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(dbTemplate), 'utf8');
}

if (!fs.existsSync(routesFile)) {
  fs.writeFileSync(routesFile, JSON.stringify(routesTemplate), 'utf8');
}
