const { nuxt } = require('./setup.js');
const { testComponent } = require('./nuxt.config.js');

describe('Example: Vuex test', () => {
  it('Get state', async () => {
    const tester = async ({ store }) => {
      expect(store.state.ando.index.counter).toBe(0);
      store.commit('ando/index/increment');
      expect(store.state.ando.index.counter).toBe(1);
    };
    await nuxt.renderRoute(testComponent.path, { req: { test: tester } });
  });
});
