const { nuxt } = require('./setup.js');
const { testComponent } = require('./nuxt.config.js');

describe('Example: Vuex test', () => {
  it('Get state', async () => {
    const tester = async ({ store }) => {
      expect(store.state.practice.ando.index.grid).toBe(35);
      store.commit('practice/ando/index/zoomOut');
      expect(store.state.practice.ando.index.grid).toBe(37);
    };
    await nuxt.renderRoute(testComponent.path, { req: { test: tester } });
  });
});
