const { Nuxt, Builder } = require('nuxt');
const config = require('./nuxt.config.js');

module.exports = {
  setup: async () => {
    const nuxt = new Nuxt(config);
    await new Builder(nuxt).build();
    return nuxt;
  },
  teardown: async (nuxt) => {
    await nuxt.close();
  },
};
