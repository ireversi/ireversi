const { getStore } = require('./setup.js');

describe('V2 mutations test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('zoom out', () => {
    // Given
    const { gridX, gridY } = store.state;

    // When
    store.commit('zoomout');

    // Then
    expect(store.state.gridX).toEqual(gridX + 2);
    expect(store.state.gridY).toEqual(gridY + 2);
  });

  it('zoom in', () => {
    // Given
    const { gridX, gridY } = store.state;

    // When
    store.commit('zoomin');

    // Then
    expect(store.state.gridX).toEqual(gridX - 2);
    expect(store.state.gridY).toEqual(gridY - 2);
  });
});

describe('V2 test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('sets a board', async () => {
    // Given
    const { pieces, candidates, standbys } = await store.$axios.$get('/board');

    // When
    await store.dispatch('getBoard');

    // Then
    expect(store.state.pieces).toEqual(expect.arrayContaining(pieces));
    expect(store.state.candidates).toEqual(expect.arrayContaining(candidates));
    expect(store.state.standbys).toEqual(expect.arrayContaining(standbys));
  });
});
