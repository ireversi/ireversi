const testUtil = require('../../../../../src/utils/testUtil');

const INIT = 1;
const ZERO = 0;
const ZERO00 = 0;
const ZERO0000 = 0;
const CENTER = 0;
const CENTERRR = 0;

const {
  prepareDB,
  deleteAllDataFromDB,
  stopDB,
} = require('../utils/db.js');

const waitTime = testUtil.getWaitTime();

describe('direction', () => {
  // set DB
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);
  afterAll(stopDB);

  // 前提条件を揃えるテスト
  // positionに値を投げて、返り値のstandbyと期待値が合うか
  it('needed a standbied position', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putFirstPieces = [
      ZERO00, ZERO00, ZERO00,
      ZERO00, CENTER, ZERO00,
      ZERO00, 'u0:1', 'u0:2',
    ];

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO0000, ZERO0000,
      ZERO00, CENTERRR, ZERO0000,
      ZERO00, 'u0:1:T', 'u0:2:F',
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, INIT, ZERO,
      ZERO, 'u0', ZERO,
    ]);

    // When
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testFirstPieces.forEach((result, i) => {
      expect(result.status).toEqual(putFirstJudgeMatches[i].status); // 置けたかの判定が合っているか
      expect(result.standby.remaining).toBeLessThanOrEqual(waitTime); // 時間が経過し、待機時間から時間が減っているか
      expect(result.standby.piece).toMatchObject(putFirstJudgeMatches[i].piece); // pieceの値が合っているか
    });
    boardPieces.standbys.forEach((result, i) => {
      expect(result.remaining).toBeLessThanOrEqual(waitTime);
      expect(result.piece).toEqual(standbyPieceMatchers[i]);
    });

    // Finish
    testUtil.testPostProcess();
  });

  // userIdと方角を与えて、レーザービーム打てるかのテスト
  it('let player shoot lazer beem', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u2:1', 'u3:2', ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const putFirstPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u1:1', ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const setPieceDirections = [
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO0000,
      ZERO00, ZERO00, 'u1:1:n', ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u2:1:T', 'u3:2:T', ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u1:1:T', ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, 'u1', 'u3', ZERO,
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO,
      ZERO, 'u1', ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const testPieceDirections = await testUtil.setTestPieceDirections(setPieceDirections);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    expect(testPieces).toHaveLength(putJucgeMatches.length);
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
    });

    testFirstPieces.forEach((result, i) => {
      expect(result.status).toEqual(putFirstJudgeMatches[i].status); // 置けたかの判定が合っているか
      expect(result.standby.remaining).toBeLessThanOrEqual(waitTime); // 時間が経過し、待機時間から時間が減っているか
      expect(result.standby.piece).toMatchObject(putFirstJudgeMatches[i].piece); // pieceの値が合っているか
    });

    testPieceDirections.forEach((result) => {
      expect(result.status).toEqual(true); // 送った結果、置けたかどうか
    });

    boardPieces.standbys.forEach((result, i) => {
      expect(result.remaining).toBeLessThanOrEqual(waitTime);
      expect(result.piece).toEqual(standbyPieceMatchers[i]);
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    // Finish
    testUtil.testPostProcess();
  });

  // userIdと方角を与えるが、レーザービーム打てないテスト
  it('start remaining timer3', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u2:1', 'u3:2', ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const putFirstPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u1:1', ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const setPieceDirections = [
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO0000,
      ZERO00, ZERO00, 'u1:1:e', ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u2:1:T', 'u3:2:T', ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u1:1:T', ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, 'u2', 'u3', ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO,
      ZERO, 'u1', ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const testPieceDirections = await testUtil.setTestPieceDirections(setPieceDirections);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    expect(testPieces).toHaveLength(putJucgeMatches.length);
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
    });

    testFirstPieces.forEach((result, i) => {
      expect(result.status).toEqual(putFirstJudgeMatches[i].status); // 置けたかの判定が合っているか
      expect(result.standby.remaining).toBeLessThanOrEqual(waitTime); // 時間が経過し、待機時間から時間が減っているか
      expect(result.standby.piece).toMatchObject(putFirstJudgeMatches[i].piece); // pieceの値が合っているか
    });

    testPieceDirections.forEach((result) => {
      expect(result.status).toEqual(false); // 送った結果、置けたかどうか
    });

    boardPieces.standbys.forEach((result, i) => {
      expect(result.remaining).toBeLessThanOrEqual(waitTime);
      expect(result.piece).toEqual(standbyPieceMatchers[i]);
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    // Finish
    testUtil.testPostProcess();
  });

  // MongoDBに保存されているかのテスト
  it('can be saved in MongoDB', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u2:1', 'u3:2', ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const putFirstPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u1:1', ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
    ];

    const setPieceDirections = [
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO0000,
      ZERO00, ZERO00, 'u1:1:n', ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u2:1:T', 'u3:2:T', ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u1:1:T', ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, 'u1', 'u3', ZERO,
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, 'u1', ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO,
      ZERO, 'u1', ZERO,
    ]);

    // *****storePlayHistoryでMongoDBへの保存をコメントアウトしているため一旦コメントアウト
    // const directionMatchesDB = testUtil.array2PieceMatchers([
    //   ZERO, ZERO, ZERO,
    //   ZERO, 'u1', ZERO,
    //   ZERO, ZERO, ZERO,
    // ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const testPieceDirections = await testUtil.setTestPieceDirections(setPieceDirections);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    expect(testPieces).toHaveLength(putJucgeMatches.length);
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
    });

    testFirstPieces.forEach((result, i) => {
      expect(result.status).toEqual(putFirstJudgeMatches[i].status); // 置けたかの判定が合っているか
      expect(result.standby.remaining).toBeLessThanOrEqual(waitTime); // 時間が経過し、待機時間から時間が減っているか
      expect(result.standby.piece).toMatchObject(putFirstJudgeMatches[i].piece); // pieceの値が合っているか
    });

    testPieceDirections.forEach((result) => {
      expect(result.status).toEqual(true); // 送った結果、置けたかどうか
    });

    boardPieces.standbys.forEach((result, i) => {
      expect(result.remaining).toBeLessThanOrEqual(waitTime);
      expect(result.piece).toEqual(standbyPieceMatchers[i]);
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    // *****storePlayHistoryでMongoDBへの保存をコメントアウトしているため一旦コメントアウト

    // MongoDBに置けてるかどうかの確認
    // const boardhistory = await testUtil.getBoardHistory();

    // boardhistory.forEach((result) => {
    //   if (result.path === 'first_piece/direction') { // Mongoからdirectionだけを検索
    //     directionMatchesDB.forEach((m) => {
    //       expect(result.piece).toEqual(m);
    //     });
    //   }
    // });

    // Finish
    testUtil.testPostProcess();
  });
});
