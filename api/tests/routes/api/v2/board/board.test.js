const testUtil = require('../../../../../src/utils/testUtil');

const ZERO = 0;
const ZERO00 = 0;
const INIT = 1;
const CENTER = 0;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

describe('piece', () => {
  // set DB
  beforeAll(testUtil.prepareDB);
  afterEach(testUtil.deleteAllDataFromDB);
  afterAll(testUtil.stopDB);

  describe('check board pieces', () => {
  // 置いた駒が全て取得できることを確認
    it('gets all', async () => {
    // Reset
      testUtil.testPreProcess();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);

      const putPieces = [
        ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
        ZERO00, 'u0:8', 'u1:1', 'u2:2', ZERO00,
        ZERO00, 'u3:7', CENTER, 'u4:3', ZERO00,
        ZERO00, 'u5:6', 'u6:5', 'u7:4', ZERO00,
        ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ];

      const pieceMatchers = testUtil.array2PieceMatchers([
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, 'u0', 'u1', 'u2', ZERO,
        ZERO, 'u3', INIT, 'u4', ZERO,
        ZERO, 'u5', 'u6', 'u7', ZERO,
        ZERO, ZERO, ZERO, ZERO, ZERO,
      ]);

      // When
      await testUtil.setTesPieces(putPieces);
      const boardPieces = await testUtil.getBoardPieces('u0');

      // Then
      expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
      expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

      // Finish
      testUtil.testPostProcess();
    });
  });

  describe('check board pieces and candidates', () => {
    it('gets pieces after turnover some pieces', async () => {
    // Reset
      testUtil.testPreProcess();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);

      const putPieces = [
        ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
        ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
        ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
        ZERO00, ZERO00, 'u0:1', ZERO00, ZERO00,
        ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ];

      const pieceMatchers = testUtil.array2PieceMatchers([
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, INIT, ZERO, ZERO,
        ZERO, ZERO, 'u0', ZERO, ZERO,
        ZERO, ZERO, ZERO, ZERO, ZERO,
      ]);

      const candidateMatchers = testUtil.array2CandidateMatchers([
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, 'u1', ZERO, ZERO,
        ZERO, 'u1', ZERO, 'u1', ZERO,
        ZERO, 'u1', ZERO, 'u1', ZERO,
        ZERO, ZERO, 'u1', ZERO, ZERO,
      ]);

      // When
      await testUtil.setTesPieces(putPieces);
      const boardPieces = await testUtil.getBoardPieces('u1');

      // Then
      // 置かれた駒のチェック
      expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
      expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));
      // セットされたtestUserに対する駒を置ける場所のチェック
      expect(boardPieces.candidates).toHaveLength(candidateMatchers.length);
      expect(boardPieces.candidates).toEqual(expect.arrayContaining(candidateMatchers));

      // Finish
      testUtil.testPostProcess();
    });
  });

  describe('the number of online users', () => {
    it('gets updated the number of online users every 2 seconds', async () => {
    // Init
      testUtil.testPreProcess();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);
      const time = 2000;

      for (let i = 0; i < userNumber; i += 1) {
        await testUtil.getBoardPieces(`u${String(i)}`);
      }

      // When
      await sleep(time);
      const boardPieces = await testUtil.getBoardPieces('u0');

      // Then
      expect(boardPieces.userCounts).toEqual(userNumber);

      // Finish
      testUtil.testPostProcess();
    });

    it('is reset the number of online users after 4 seconds from last request', async () => {
    // Init
      testUtil.testPreProcess();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);
      const time = 4000;

      for (let i = 0; i < userNumber; i += 1) {
        await testUtil.getBoardPieces(`u${String(i)}`);
      }

      // When
      await sleep(time);
      const boardPieces = await testUtil.getBoardPieces('u9');

      // Then
      expect(boardPieces.userCounts).toEqual(0);

      // Finish
      testUtil.testPostProcess();
    });
  });
});
