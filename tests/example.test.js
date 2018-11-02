const { getStore } = require('./setup.js');

describe('Example: Vuex test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('Get state', () => {
    // Given
    const { gridX } = store.state;

    // When
    store.commit('zoomout');

    // Then
    expect(store.state.gridX).toBe(gridX + 2);
  });
});
