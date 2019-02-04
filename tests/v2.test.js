const { getStore, build, teardown } = require('./setup.js');
const app = require('../api/routes/app.js');
const { port } = require('../api/config.js');
const { prepareDB, deleteAllDataFromDB, stopDB } = require('../api/utils/db.js');
const PieceStore = require('../api/models/v1/PieceStore.js');

jest.setTimeout(30000);

describe('V1 test', () => {
  let store;

  beforeAll(async () => {
    await build();
    await prepareDB();
    app.listen(port);
  });

  beforeEach(async () => {
    PieceStore.initPieces();
    store = await getStore();
  });

  afterEach(async () => {
    PieceStore.deletePieces();
    await deleteAllDataFromDB();
  });

  afterAll(async () => {
    teardown();
    await stopDB();
  });

  it('sets a board', async () => {
    // Given
    const USERNAME = 'username'; // 4文字以上15文字以下、アルファベット小文字、数字、アンダースコアのみ
    await store.dispatch('getAccessToken', USERNAME);

    const { pieces, candidates, standbys } = await store.$axios.$get('/board');

    // When
    await store.dispatch('getBoard');

    // Then
    expect(store.state.pieces).toEqual(expect.arrayContaining(pieces));
    expect(store.state.candidates).toEqual(expect.arrayContaining(candidates));
    expect(store.state.standbys).toEqual(expect.arrayContaining(standbys));
  });
});
