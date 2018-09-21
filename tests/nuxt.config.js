const { resolve } = require('path');
const { axios, env, modules } = require('../nuxt.config.js');

const testComponent = {
  name: 'executer',
  path: '/tests/executer',
  component: resolve(__dirname, 'executer.vue'),
};
const config = {
  axios,
  env,
  modules,
  mode: 'universal',
  dev: false,
  rootDir: resolve(__dirname, '..'),
  router: {
    extendRoutes(routes) {
      routes.push(testComponent);
    },
  },
};

module.exports = { config, testComponent };
