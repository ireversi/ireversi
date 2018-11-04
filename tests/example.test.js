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
    // store.commit('Any');

    // Then
    expect(gridX).toBe(11);
  });
});
