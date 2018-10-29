const { getStore } = require('./setup.js');

describe('V2 test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('sets a board', async () => {
    // Given
    await store.dispatch('getAccessToken');

    store.$axios.setHeader('Authorization', store.state.token);
    const { pieces, candidates, standbys } = await store.$axios.$get('/board');

    // When
    await store.dispatch('getBoard');

    // Then
    expect(store.state.pieces).toEqual(expect.arrayContaining(pieces));
    expect(store.state.candidates).toEqual(expect.arrayContaining(candidates));
    expect(store.state.standbys).toEqual(expect.arrayContaining(standbys));
  });
});
