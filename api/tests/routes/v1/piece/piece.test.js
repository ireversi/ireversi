const testUtil = require('../../../../../src/utils/testUtil');

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const INIT = 1;
const ZERO = 0;
const ZERO00 = 0;
const ZERO0000 = 0;
const CENTER = 0;
const CENTERRR = 0;

describe('piece', () => {
  // set DB
  beforeAll(testUtil.prepareDB);
  afterEach(testUtil.deleteAllDataFromDB);
  afterAll(testUtil.stopDB);

  describe('piece', () => {
    // 既に駒が置いてある場所にはおけない。
    it('cannot be put on the same place', async () => {
      // Reset
      testUtil.testPreProcess();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);

      // prettier-ignore
      const putPieces = [
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, CENTER, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, 'u0:1', ['u1:2', 'u2:3'], 'u0:4',
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
      ];

      // prettier-ignore
      const putJucgeMatches = await testUtil.setTestMatchers([
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, CENTERRR, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, 'u0:1:T', ['u1:2:T', 'u2:3:F'], 'u0:4:T',
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
      ]);

      // prettier-ignore
      const pieceMatchers = testUtil.array2PieceMatchers([
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, INIT, ZERO, ZERO,
        ZERO, ZERO, 'u0', 'u0', 'u0',
        ZERO, ZERO, ZERO, ZERO, ZERO,
      ]);

      // When
      const testPieces = await testUtil.setTesPieces(putPieces);
      const boardPieces = await testUtil.getBoardPieces('u0');
      const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

      testMatchesDB.forEach((t) => {
        expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
      });

      // Finish
      testUtil.testPostProcess();
    });
  });

  // ２駒目は他の駒を挟まないところには置けない
  it('is put', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u0:1', 'u1:2', ZERO00,
      ZERO00, ZERO00, ZERO00, 'u0:3', ZERO00,
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO0000,
      ZERO00, ZERO00, 'u0:1:T', 'u1:2:T', ZERO0000,
      ZERO00, ZERO00, ZERO0000, 'u0:3:F', ZERO0000,
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, 'u0', 'u1', ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  // 離れたところは置けない1
  it('never become alone (far away from the other pieces)', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      'u0:1', ZERO00, ZERO00,
      ZERO00, CENTER, 'u1:4',
      ZERO00, 'u1:3', 'u1:2',
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ZERO0000, ZERO0000,
      ZERO0000, CENTERRR, 'u1:4:F',
      ZERO0000, 'u1:3:T', 'u1:2:F',
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, INIT, ZERO,
      ZERO, 'u1', ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  // 離れたところは置けない2
  it('never become alone (far away from the other pieces)2', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      'u0:1', ZERO00, 'u1:2',
      ZERO00, CENTER, ZERO00,
      ZERO00, ZERO00, 'u1:3',
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ZERO0000, 'u1:2:F',
      ZERO0000, CENTERRR, ZERO0000,
      ZERO0000, ZERO0000, 'u1:3:F',
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, INIT, ZERO,
      ZERO, ZERO, ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  // 盤面で１手目の場合、斜めに置けないテスト
  it('can be put on cell next to the other pieces not on diagle cells', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      'u0:5', ZERO00, ['u0:4', 'u4:7'],
      'u2:3', 'u3:2', [ZERO00, ZERO00],
      ZERO00, 'u1:1', ['u0:6', ZERO00],
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:5:T', ZERO0000, ['u0:4:F', 'u4:7:F'],
      'u2:3:T', 'u3:2:F', [ZERO0000, ZERO0000],
      ZERO0000, 'u1:1:T', ['u0:6:T', ZERO0000],
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      'u0', ZERO, ZERO,
      'u2', 'u0', ZERO,
      ZERO, 'u1', 'u0',
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  // 盤面に自コマがない場合、他コマの上下左右だけおける。斜めには置けないテスト。
  it('can be put on a cell next to the other pieces', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      'u0:1', ['u1:4', ZERO00], ZERO00,
      ZERO00, ['u2:3', 'u2:5'], ZERO00,
      ZERO00, [ZERO00, ZERO00], 'u1:2',
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ['u1:4:T', ZERO0000], ZERO0000,
      ZERO0000, ['u2:3:F', 'u2:5:F'], ZERO0000,
      ZERO0000, [ZERO0000, ZERO0000], 'u1:2:F',
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, 'u1', ZERO,
      ZERO, INIT, ZERO,
      ZERO, ZERO, ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });

  it('can flip with defalut piece', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // prettier-ignore
    const putPieces = [
      ZERO00, ZERO00, 'u0:4',
      ZERO00, 'u2:2', 'u3:3',
      ZERO00, 'u1:1', ZERO00,
    ];

    // prettier-ignore
    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO0000, 'u0:4:T',
      ZERO00, 'u2:2:F', 'u3:3:T',
      ZERO00, 'u1:1:T', ZERO0000,
    ]);

    // prettier-ignore
    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, 'u0',
      ZERO, INIT, 'u3',
      ZERO, 'u1', ZERO,
    ]);

    // When
    const testPieces = await testUtil.setTesPieces(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');
    const testMatchesDB = putJucgeMatches.filter((m) => m.status === true);

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

    testMatchesDB.forEach((t) => {
      expect(boardhistory).toContainEqual(expect.objectContaining({ piece: t.piece }));
    });

    // Finish
    testUtil.testPostProcess();
  });
});
