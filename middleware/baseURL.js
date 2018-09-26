export default ({ route, $axios }) => {
  /* eslint-disable no-param-reassign */
  if (process.env.MOCK_DB_PORT) {
    $axios.defaults.baseURL = `http://localhost:${process.env.MOCK_DB_PORT}`;
  } else {
    $axios.defaults.baseURL = `${process.env.AXIOS_BASE}/${/^\/practice\//.test(route.path) ? 'v1' : 'v2'}`;
  }
};
