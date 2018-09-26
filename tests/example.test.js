const { getStore } = require('./setup.js');
const {
  getDB,
  prepareMock,
  deleteMock,
} = require('../mock/testUtil.js');

describe('Example: Vuex test', () => {
  let store;

  beforeEach(() => Promise.all([
    prepareMock(),
    (async () => {
      store = await getStore();
    })(),
  ]));

  afterEach(deleteMock);

  it('Get state', () => {
    expect(store.state.ando.index.counter).toBe(0);
    store.commit('ando/index/increment');
    expect(store.state.ando.index.counter).toBe(1);
  });

  it('Get board', async () => {
    // Given
    const { board } = await getDB();

    // When
    await store.dispatch('sample/getBoard');

    // Then
    expect(store.state.sample.board).toEqual(board);
  });
});
