const { getStore } = require('./setup.js');

describe('Example: Vuex test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('Get state', () => {
    // Given
    const { grid } = store.state.practice.ando.index;

    // When
    store.commit('practice/ando/index/zoomOut');

    // Then
    expect(store.state.practice.ando.index.grid).toBe(grid + 2);
  });
});
