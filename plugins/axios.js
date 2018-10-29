export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
    const url = new URL(`${config.baseURL}${config.url}`);
    /* eslint-disable no-param-reassign */
    config.url = url.href;
    if (typeof config.data === 'object') {
      const params = new URLSearchParams();
      Object.keys(config.data).forEach(key => params.append(key, config.data[key]));
      config.data = params;
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    config.headers.Authorization = store.state.token;
  });
};
