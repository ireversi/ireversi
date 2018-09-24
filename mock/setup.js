const fs = require('fs');
const path = require('path');
const template = require('./db.template.js');

const dbFile = path.join(__dirname, 'db.json');

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(template), 'utf8');
}
