const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../../../../../src/routes/app.js');
const BoardStore = require('../../../../../src/models/v2/BoardStore.js');
const PieceStore = require('../../../../../src/models/v2/PieceStore.js');
const generateToken = require('../../../../../src/routes/api/v2/userIdGenerate/generateToken');

const basePath = '/api/v2/board';
const ZERO = 0;
const INIT = 1;
const TEST_USER_NUMBER = 10;
let testUsers = [];

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

function setTestUser() {
  testUsers = [...Array(TEST_USER_NUMBER)].map(() => generateToken.generate());
}

const u = n => jwt.decode(testUsers[n]).userId;

function array2PieceMatchers(array) {
  const size = Math.sqrt(array.length);
  return (array.map((p, idx) => (p !== 0 ? {
    x: Math.floor(idx % size) - Math.floor(size / 2),
    y: Math.floor(idx / size) - Math.floor(size / 2),
    userId: p,
  } : p))).filter(p => p !== 0);
}

function array2CandidateMatchers(array) {
  const size = Math.sqrt(array.length);
  return (array.map((p, idx) => (p !== 0 ? {
    x: Math.floor(idx % size) - Math.floor(size / 2),
    y: Math.floor(idx / size) - Math.floor(size / 2),
  } : p))).filter(p => p !== 0);
}

function setTesPieces(pieces, size) {
  pieces.forEach((p, idx) => {
    if (p !== 0) {
      PieceStore.addPiece({
        x: Math.floor(idx % size) - Math.floor(size / 2),
        y: Math.floor(idx / size) - Math.floor(size / 2),
        userId: p,
      });
    }
  });
}


describe('check board pieces', () => {
  // 利用するテストユーザーをセットする。ユーザー数はTEST_USER_NUMBERにて設定
  setTestUser(TEST_USER_NUMBER);

  // 置いた駒が全て取得できることを確認
  it('gets all', async () => {
    await chai.request(app).delete(`${basePath}`);
    PieceStore.initPieces();

    // Given
    const putPieces = [
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, u(0), u(1), u(2), ZERO,
      ZERO, u(3), INIT, u(4), ZERO,
      ZERO, u(5), u(6), u(7), ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ];

    const pieceMatchers = array2PieceMatchers(putPieces);
    const size = Math.sqrt(putPieces.length);
    setTesPieces(putPieces, size);

    // When
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[0]);

    // Then
    expect(response.body.pieces).toHaveLength(pieceMatchers.length);
    expect(response.body.pieces).toEqual(expect.arrayContaining(pieceMatchers));
  });
});

describe('check board pieces and candidates', () => {
  // 一つ駒を置く
  it('gets pieces after turnover some pieces', async () => {
    await chai.request(app).delete(`${basePath}`);
    PieceStore.deletePieces();

    // Given
    // piece set
    const putPieces = [
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, u(0), ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ];
    const size = Math.sqrt(putPieces.length);
    setTesPieces(putPieces, size);

    const pieceMatchers = array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, u(0), ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    const candidateMatchers = array2CandidateMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, u(1), ZERO, ZERO,
      ZERO, u(1), ZERO, u(1), ZERO,
      ZERO, u(1), ZERO, u(1), ZERO,
      ZERO, ZERO, u(1), ZERO, ZERO,
    ]);

    // When
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[1]);
    // Then
    // 置かれた駒のチェック
    expect(response.body.pieces).toHaveLength(pieceMatchers.length);
    expect(response.body.pieces).toEqual(expect.arrayContaining(pieceMatchers));
    // セットされたtestUserに対する駒を置ける場所のチェック
    expect(response.body.candidates).toHaveLength(candidateMatchers.length);
    expect(response.body.candidates).toEqual(expect.arrayContaining(candidateMatchers));
  });
});

describe('the number of online users', () => {
  it('gets updated the number of online users every 2 seconds', async () => {
    await chai.request(app).delete(`${basePath}`);
    PieceStore.deletePieces();
    BoardStore.resetUserCounts();

    // Given
    const users = 4;
    const time = 2000;
    const tokens = [];
    for (let i = 0; i < users; i += 1) {
      tokens[i] = generateToken.generate();
      await chai.request(app)
        .get(`${basePath}`)
        .set('Authorization', tokens[i]);
    }

    // When
    await sleep(time);
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', tokens[users - 1]);

    // Then
    expect(response.body.userCounts).toEqual(users);
  });

  it('is reset the number of online users after 4 seconds from last request', async () => {
    await chai.request(app).delete(`${basePath}`);
    PieceStore.deletePieces();
    BoardStore.resetUserCounts();

    // Given
    const users = 4;
    const time = 4000;
    const tokens = [];
    for (let i = 0; i < users; i += 1) {
      tokens[i] = generateToken.generate();
      await chai.request(app)
        .get(`${basePath}`)
        .set('Authorization', tokens[i]);
    }

    // When
    await sleep(time);
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', tokens[users - 1]);

    // Then
    expect(response.body.userCounts).toEqual(0);
  });
});
