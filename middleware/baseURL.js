export default ({ route, $axios }) => {
  /* eslint-disable no-param-reassign */
  $axios.defaults.baseURL = `${process.env.AXIOS_BASE}/${/^\/practice\//.test(route.path) ? 'v1' : 'v2'}`;
};
