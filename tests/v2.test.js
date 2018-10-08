const { getStore } = require('./setup.js');

describe('V2 test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('sets a board', async () => {
    // Given
    const { pieces, candidates, standbys } = await store.$axios.$get(`/board?userId=${store.state.currentUser}`);

    // When
    await store.dispatch('getBoard');

    // Then
    expect(store.state.pieces).toEqual(expect.arrayContaining(pieces));
    expect(store.state.candidates).toEqual(expect.arrayContaining(candidates));
    expect(store.state.standbys).toEqual(expect.arrayContaining(standbys));
  });
});
