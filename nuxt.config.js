const pkg = require('./package');
require('dotenv').config();

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: ['element-ui/lib/theme-chalk/index.css'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['@/plugins/element-ui'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
  // See https://github.com/nuxt-community/axios-module#options
  },
  env: {
    IS_MOCKING: process.env.IS_MOCKING,
    MOCKING_PORT: process.env.MOCKING_PORT,
    AXIOS_BASE: process.env.AXIOS_BASE,
    FUJII_PATH: process.env.FUJII_PATH,
    KIDO_PATH: process.env.KIDO_PATH,
    MATSUDA_PATH: process.env.MATSUDA_PATH,
    KIMURA_PATH: process.env.KIMURA_PATH,
    KAI_PATH: process.env.KAI_PATH,
    ANDO_PATH: process.env.ANDO_PATH,
  },
  router: {
    middleware: 'baseURL',
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
