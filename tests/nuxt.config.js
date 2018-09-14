const { resolve } = require('path');
const {
  mode, modules, axios, env,
} = require('../nuxt.config.js');

module.exports = {
  rootDir: resolve(__dirname, '..'),
  mode,
  modules,
  axios,
  env,
};
