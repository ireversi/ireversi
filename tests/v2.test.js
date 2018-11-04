const { getStore } = require('./setup.js');

describe('V2 test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('sets a board', async () => {
    // Given
    const USERNAME = 'username'; // 4文字以上15文字以下、アルファベット小文字、数字、アンダースコアのみ
    await store.dispatch('getAccessToken', USERNAME);


    console.log(store.state.token);
    console.log(store.state.token);
    console.log(store.state.token);
    console.log(store.state.token);
    console.log(store.state.token);
    console.log(store.state.token);

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
