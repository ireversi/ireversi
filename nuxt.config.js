require('dotenv').config();

const { NODE_ENV, AXIOS_BASE, GOOGLE_ANALYTICS } = process.env;

module.exports = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: 'iReversi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Infinity Reversi' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/axios', '@/plugins/window-state', '@/plugins/vue-touch'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    ...(GOOGLE_ANALYTICS ? [['@nuxtjs/google-analytics', { id: GOOGLE_ANALYTICS }]] : []),
  ],

  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: NODE_ENV !== 'test' && AXIOS_BASE ? AXIOS_BASE : 'http://localhost:10000/api/v1',
  },

  /*
   ** Environment variable
   */
  env: {
    NODE_ENV,
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
  toast: {
    position: 'top-center' /* トーストの表示位置 */,
    // duration: 3000, /* トーストの表示されている時間（今回は2秒に設定） */
  },
};
