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
    // Given
    const { grid } = store.state.practice.ando.index;

    // When
    store.commit('practice/ando/index/zoomOut');

    // Then
    expect(store.state.practice.ando.index.grid).toBe(grid + 2);
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
