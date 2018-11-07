// import Vue from 'vue';
import { URLSearchParams } from 'universal-url';

export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
    /* eslint-disable no-param-reassign */
    config.url = `${config.baseURL}${config.url}`;
    if (typeof config.data === 'object') {
      const params = new URLSearchParams();
      Object.keys(config.data).forEach(key => params.append(key, config.data[key]));
      config.data = params.toString();
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (store.state.token) config.headers.Authorization = store.state.token;
  });
  // $axios.onError((error) => {
  // const code = parseInt(error.response && error.response.status, 10);
  // if (code === 500) {
  //   Vue.toasted.error('Internal Server Error');
  // } else if (code === 404) {
  //   Vue.toasted.error('Cannot find the page');
  // } else {
  //   Vue.toasted.error('Network Error');
  // }
  // });
};
