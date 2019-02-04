export default ({ $axios }) => {
  /* eslint-disable no-param-reassign */
  $axios.defaults.baseURL = `${process.env.AXIOS_BASE}/v1`;
};
