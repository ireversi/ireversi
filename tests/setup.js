const { Nuxt, Builder } = require('nuxt');
const { config } = require('./nuxt.config.js');

const nuxt = new Nuxt(config);

module.exports = {
  nuxt,
  build: async () => {
    await new Builder(nuxt).build();
  },
  teardown: () => {
    nuxt.close();
  },
};
