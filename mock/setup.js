const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.json');

if (!fs.existsSync(dbFile)) {
  const template = require('./db.template.js');
  fs.writeFileSync(dbFile, JSON.stringify(template), 'utf8');
}
