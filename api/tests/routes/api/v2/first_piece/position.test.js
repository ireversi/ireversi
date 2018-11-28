
const testUtil = require('../../../../../src/utils/testUtil');

const waitTime = testUtil.getWaitTime();

// const INIT = 1;
const ZERO = 0;
const ZERO00 = 0;
const ZERO0000 = 0;
const CENTER = 0;
const CENTERRR = 0;

const {
  prepareDB,
  deleteAllDataFromDB,
  stopDB,
} = require('../../../../../src/utils/db.js');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

describe('piece', () => {
  // set DB
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);
  afterAll(stopDB);

  // テスト：positionが置けるか。
  it('is stoodby in a board array', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putFirstPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u0:1', 'u1:2', ZERO00,
      ZERO00, ZERO00, 'u1:3', ZERO00, ZERO00,
    ];

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO00,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO00,
      ZERO00, ZERO00, 'u0:1:T', 'u1:2:F', ZERO00,
      ZERO00, ZERO00, 'u1:3:F', ZERO0000, ZERO00,
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO,
      ZERO, 'u0', ZERO,
    ]);

    // When
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putFirstJudgeMatches.filter(m => m.status === true);

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

    await sleep(waitTime); // 3500ミリ秒待機
    const afterBoardPieces = await testUtil.getBoardPieces('u0');
    expect(afterBoardPieces.standbys).toHaveLength(0);

    const boardhistory = await testUtil.getBoardHistory();
    expect(boardhistory).toHaveLength(testMatchesDB.length);

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  // テスト：他コマ（デフォルトコマ）の上には置けない。それ以外は置ける。
  it('is stoodby in a board array', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putFirstPieces = [
      ZERO00, [ZERO00, ZERO00], ZERO00, ZERO00, ZERO00,
      ZERO00, ['u0:1', ZERO00], ZERO00, 'u3:4', ZERO00,
      ZERO00, ['u2:3', ZERO00], 'u1:2', 'u4:5', ZERO00,
      ZERO00, ['u5:6', 'u8:9'], 'u8:9', 'u1:2', ZERO00,
      ZERO00, [ZERO00, ZERO00], ZERO00, ZERO00, ZERO00,
    ];

    const putFirstJudgeMatches = await testUtil.setTestMatchers([
      ZERO00, [ZERO0000, ZERO0000], ZERO0000, ZERO0000, ZERO00,
      ZERO00, ['u0:1:F', ZERO0000], ZERO0000, 'u3:4:F', ZERO00,
      ZERO00, ['u2:3:T', ZERO0000], 'u1:2:F', 'u4:5:T', ZERO00,
      ZERO00, ['u5:6:F', 'u8:9:F'], 'u8:9:T', 'u1:2:F', ZERO00,
      ZERO00, [ZERO0000, ZERO0000], ZERO0000, ZERO0000, ZERO00,
    ]);

    const standbyPieceMatchers = testUtil.array2StandbyPieceMatchers([
      ZERO, ZERO, ZERO,
      'u2', ZERO, 'u4',
      ZERO, 'u8', ZERO,
    ]);

    // When
    const testFirstPieces = await testUtil.setTestFirstPieces(putFirstPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putFirstJudgeMatches.filter(m => m.status === true);

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

    await sleep(waitTime); // 3500ミリ秒待機
    const afterBoardPieces = await testUtil.getBoardPieces('u0');
    expect(afterBoardPieces.standbys).toHaveLength(0);

    const boardhistory = await testUtil.getBoardHistory();
    expect(boardhistory).toHaveLength(testMatchesDB.length);

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });
});
