const { Nuxt } = require('nuxt');
const { config } = require('./nuxt.config.js');

module.exports = () => new Nuxt(config);
