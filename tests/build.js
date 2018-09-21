const { Builder } = require('nuxt');
const setup = require('./setup.js');

module.exports = async () => {
  const nuxt = setup();
  await new Builder(nuxt).build();
  nuxt.close();
};
