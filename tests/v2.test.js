const { getStore } = require('./setup.js');
const app = require('../api/src/routes/app.js');
const { port } = require('../api/src/config.js');
const {
  prepareDB,
  deleteAllDataFromDB,
} = require('../api/src/utils/db.js');
const PieceStore = require('../api/src/models/v2/PieceStore.js');

describe('V2 test', () => {
  let store;

  beforeAll(async () => {
    await prepareDB();
    await new Promise(resolve => app.listen(port, resolve));
  });

  beforeEach(async () => {
    PieceStore.initPieces();
    store = await getStore();
  });

  afterEach(async () => {
    PieceStore.deletePieces();
    await deleteAllDataFromDB();
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
