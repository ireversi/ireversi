const { Nuxt, Builder } = require('nuxt');
const { config, testComponent } = require('./nuxt.config.js');

const nuxt = new Nuxt(config);

module.exports = {
  getStore: () => new Promise((resolve) => {
    nuxt.renderRoute(testComponent.path, {
      req: { test: resolve },
    });
  }),
  build: () => new Builder(nuxt).build(),
  teardown: () => {
    nuxt.close();
  },
};
