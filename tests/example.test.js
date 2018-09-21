const setup = require('./setup.js');
const { testComponent } = require('./nuxt.config.js');

let nuxt;
beforeAll(() => {
  nuxt = setup();
});
afterAll(() => {
  nuxt.close();
});

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
