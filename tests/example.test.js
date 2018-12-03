const { getStore, build, teardown } = require('./setup.js');

describe('Example: Vuex test', () => {
  let store;

  beforeAll(async () => {
    await build();
  });

  beforeEach(async () => {
    store = await getStore();
  });

  afterAll(teardown);

  it('Get state', () => {
    // Given
    const { gridX } = store.state;

    // When
    // store.commit('Any');

    // Then
    expect(gridX).toBe(11);
  });
});
