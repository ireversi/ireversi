
const testUtil = require('../../../../../src/utils/testUtil');

// const INIT = 1;
const ZERO = 0;
const ZERO00 = 0;
const ZERO000 = 0;
const ZERO0000 = 0;
const ZERO00000 = 0;
// const CENTER = 0;
const CENTERR = 0;
// const CENTERRR = 0;
const CENTERRRR = 0;

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const {
  prepareDB,
  deleteAllDataFromDB,
  stopDB,
} = require('../utils/db.js');

describe('score', () => {
  // set DB
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);
  afterAll(stopDB);

  // 一つ駒を置く
  it('gets score', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      ZERO00, ZERO00, ZERO000, ZERO00, ZERO000, ZERO000, ZERO000,
      ZERO00, ZERO00, 'u0:15', 'u6:18', 'u7:19', 'u8:20', 'u7:21',
      ZERO00, ZERO00, 'u3:04', 'u0:05', 'u4:06', 'u3:09', ZERO000,
      ZERO00, ZERO00, 'u2:03', CENTERR, 'u5:07', 'u4:10', 'u2:14',
      ZERO00, ZERO00, 'u1:02', 'u0:01', 'u6:08', 'u1:11', ZERO000,
      ZERO00, ZERO00, 'u0:16', 'u5:17', ZERO000, 'u8:12', ZERO000,
      ZERO00, ZERO00, ZERO000, ZERO000, ZERO000, 'u3:13', ZERO000,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO0000, ZERO0000, ZERO00000, ZERO00000, ZERO00000, ZERO00000, ZERO00000,
      ZERO0000, ZERO0000, 'u0:15:T', 'u6:18:T', 'u7:19:T', 'u8:20:T', 'u7:21:T',
      ZERO0000, ZERO0000, 'u3:04:T', 'u0:05:T', 'u4:06:T', 'u3:09:T', ZERO00000,
      ZERO0000, ZERO0000, 'u2:03:T', CENTERRRR, 'u5:07:T', 'u4:10:T', 'u2:14:T',
      ZERO0000, ZERO0000, 'u1:02:T', 'u0:01:T', 'u6:08:T', 'u1:11:T', ZERO00000,
      ZERO0000, ZERO0000, 'u0:16:T', 'u5:17:T', ZERO00000, 'u8:12:T', ZERO00000,
      ZERO0000, ZERO0000, ZERO00000, ZERO00000, ZERO00000, 'u3:13:T', ZERO00000,
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, 'u0', 'u6', 'u7', 'u7', 'u7',
      ZERO, ZERO, 'u0', 'u3', 'u3', 'u3', ZERO,
      ZERO, ZERO, 'u0', 'u2', 'u2', 'u2', 'u2',
      ZERO, ZERO, 'u0', 'u1', 'u1', 'u3', ZERO,
      ZERO, ZERO, 'u0', 'u5', ZERO, 'u3', ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO, 'u3', ZERO,
    ]);

    const topScoreMatchers = testUtil.array2RankMatchers([
      { rank: 1, user: 'u3', score: 6 },
      { rank: 2, user: 'u0', score: 5 },
      { rank: 3, user: 'u2', score: 4 },
      { rank: 4, user: 'u7', score: 3 },
      { rank: 5, user: 'u1', score: 2 },
    ]);

    // When
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // 上位何名まで反映するか
    const rankNum = 5;
    const topScore = await testUtil.getTopScore(rankNum, 'u0');

    // Then
    expect(testPieces).toHaveLength(putJucgeMatches.length);
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const boardhistory = await testUtil.getBoardHistory();
    expect(boardhistory).toHaveLength(testMatchesDB.length);

    // matchesから
    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    expect(topScore).toHaveLength(topScoreMatchers.length);
    expect(topScore).toEqual(expect.arrayContaining(topScoreMatchers));

    // Finish
    testUtil.testPostProcess();
  });
});
