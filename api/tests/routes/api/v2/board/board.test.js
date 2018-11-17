const chai = require('chai');
const app = require('../../../../../src/routes/app.js');
const testUtil = require('../../../../../src/utils/testUtil');

const basePath = '/api/v2/board';
const ZERO = 0;
const INIT = 1;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

describe('check board pieces', () => {
  // 置いた駒が全て取得できることを確認
  it('gets all', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    const testUsers = await testUtil.setTestUsers(userNumber);
    const u = n => testUsers[n].userId;

    const putPieces = [
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, u(0), u(1), u(2), ZERO,
      ZERO, u(3), INIT, u(4), ZERO,
      ZERO, u(5), u(6), u(7), ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ];
    testUtil.setTesPieces(putPieces);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, u(0), u(1), u(2), ZERO,
      ZERO, u(3), INIT, u(4), ZERO,
      ZERO, u(5), u(6), u(7), ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    // When
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[0].accessToken);

    // Then
    expect(response.body.pieces).toHaveLength(pieceMatchers.length);
    expect(response.body.pieces).toEqual(expect.arrayContaining(pieceMatchers));
  });
});

describe('check board pieces and candidates', () => {
  it('gets pieces after turnover some pieces', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    const testUsers = await testUtil.setTestUsers(userNumber);
    const u = n => testUsers[n].userId;

    const putPieces = [
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, u(0), ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ];
    testUtil.setTesPieces(putPieces);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, u(0), ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    const candidateMatchers = testUtil.array2CandidateMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, u(1), ZERO, ZERO,
      ZERO, u(1), ZERO, u(1), ZERO,
      ZERO, u(1), ZERO, u(1), ZERO,
      ZERO, ZERO, u(1), ZERO, ZERO,
    ]);

    // When
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[1].accessToken);
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
    // Init
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    const testUsers = await testUtil.setTestUsers(userNumber);
    const time = 2000;

    for (let i = 0; i < testUsers.length; i += 1) {
      await chai.request(app)
        .get(`${basePath}`)
        .set('Authorization', testUsers[i].accessToken);
    }

    // When
    await sleep(time);
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[0].accessToken);

    // Then
    expect(response.body.userCounts).toEqual(userNumber);
  });

  it('is reset the number of online users after 4 seconds from last request', async () => {
    // Init
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    const testUsers = await testUtil.setTestUsers(userNumber);
    const time = 4000;
    for (let i; i < testUsers.length; i += 1) {
      await chai.request(app)
        .get(`${basePath}`)
        .set('Authorization', testUsers[i].accessToken);
    }

    // When
    await sleep(time);
    const response = await chai.request(app)
      .get(`${basePath}`)
      .set('Authorization', testUsers[userNumber - 1].accessToken);

    // Then
    expect(response.body.userCounts).toEqual(0);
  });
});
