const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.json');

if (!fs.existsSync(dbFile)) {
  fs.copyFileSync(path.join(__dirname, 'db.template.json'), dbFile);
}
