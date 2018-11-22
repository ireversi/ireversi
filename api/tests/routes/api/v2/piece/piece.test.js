const BoardHistoryModel = require('../../../../../src/models/v2/BoardHistoryModel.js');
const testUtil = require('../../../../../src/utils/testUtil');

const sendMongo = require('../../../../../src/utils/sendMongo.js');

const {
  prepareDB,
  deleteAllDataFromDB,
  stopDB,
} = require('../../../../../src/utils/db.js');


const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const propFilter = '-_id -__v';

const ZERO = 0;
const INIT = 1;
const ZERO00 = 0;
const ZERO0000 = 0;
const CENTER = 0;
const CENTERRR = 0;

describe('piece', () => {
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);
  afterAll(stopDB);

  describe('piece', () => {
    // 既に駒が置いてある場所にはおけない。
    it('cannot be put on the same place', async () => {
      // Reset
      testUtil.initTestParameter();

      // Given
      const userNumber = 10;
      await testUtil.setTestUsers(userNumber);

      const putPieces = [
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, CENTER, [ZERO00, ZERO00], ZERO00,
        ZERO00, ZERO00, 'u0:1', ['u1:2', 'u2:3'], 'u0:4',
        ZERO00, ZERO00, ZERO00, [ZERO00, ZERO00], ZERO00,
      ];

      const putJucgeMatches = await testUtil.setTestMatchers([
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, CENTERRR, [ZERO0000, ZERO0000], ZERO0000,
        ZERO00, ZERO00, 'u0:1:T', ['u1:2:T', 'u2:3:F'], 'u0:4:T',
        ZERO00, ZERO00, ZERO0000, [ZERO0000, ZERO0000], ZERO0000,
      ]);

      const pieceMatchers = testUtil.array2PieceMatchers([
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, ZERO, ZERO, ZERO,
        ZERO, ZERO, INIT, ZERO, ZERO,
        ZERO, ZERO, 'u0', 'u0', 'u0',
        ZERO, ZERO, ZERO, ZERO, ZERO,
      ]);

      // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
      const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

      // When
      const testPieces = await testUtil.setTesPieces2(putPieces);
      const boardPieces = await testUtil.getBoardPieces('u0');

      // Then
      testPieces.forEach((result, i) => {
        expect(result).toEqual(putJucgeMatches[i]);
        expect(result).toEqual(expect.objectContaining({
          status: putJucgeMatches[i].status,
          piece: {
            x: putJucgeMatches[i].piece.x,
            y: putJucgeMatches[i].piece.y,
            userId: putJucgeMatches[i].piece.userId,
          },
        }));
      });

      expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
      expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

      await sleep(2000); // 2000ミリ秒待機
      const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
      expect(pieceData).toHaveLength(testMatchesDB.length);

      // matchesから
      for (let i = 0; i < testMatchesDB.length; i += 1) {
        expect(pieceData).toContainEqual(
          expect.objectContaining({ piece: testMatchesDB[i].piece }),
        );
      }
      await sendMongo.stopSendingMongo();
    });
  });


  // ２駒目は他の駒を挟まないところには置けない
  it('is put', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // Given
    const putPieces = [
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, ZERO00, ZERO00, ZERO00,
      ZERO00, ZERO00, CENTER, ZERO00, ZERO00,
      ZERO00, ZERO00, 'u0:1', 'u1:2', ZERO00,
      ZERO00, ZERO00, ZERO00, 'u0:3', ZERO00,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, ZERO0000, ZERO0000, ZERO0000,
      ZERO00, ZERO00, CENTERRR, ZERO0000, ZERO0000,
      ZERO00, ZERO00, 'u0:1:T', 'u1:2:T', ZERO0000,
      ZERO00, ZERO00, ZERO0000, 'u0:3:F', ZERO0000,
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
      ZERO, ZERO, INIT, ZERO, ZERO,
      ZERO, ZERO, 'u0', 'u1', ZERO,
      ZERO, ZERO, ZERO, ZERO, ZERO,
    ]);


    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    // When
    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });

  // 離れたところは置けない1
  it('never become alone (far away from the other pieces)', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      'u0:1', ZERO00, ZERO00,
      ZERO00, CENTER, 'u1:4',
      ZERO00, 'u1:3', 'u1:2',
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ZERO0000, ZERO0000,
      ZERO0000, CENTERRR, 'u1:4:F',
      ZERO0000, 'u1:3:T', 'u1:2:F',
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, INIT, ZERO,
      ZERO, 'u1', ZERO,
    ]);

    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });

  // 離れたところは置けない2
  it('never become alone (far away from the other pieces)2', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      'u0:1', ZERO00, 'u1:2',
      ZERO00, CENTER, ZERO00,
      ZERO00, ZERO00, 'u1:3',
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ZERO0000, 'u1:2:F',
      ZERO0000, CENTERRR, ZERO0000,
      ZERO0000, ZERO0000, 'u1:3:F',
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, ZERO,
      ZERO, INIT, ZERO,
      ZERO, ZERO, ZERO,
    ]);

    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });

  // 盤面で１手目の場合、斜めに置けないテスト
  it('can be put on cell next to the other pieces not on diagle cells', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      'u0:5', ZERO00, ['u0:4', 'u4:7'],
      'u2:3', 'u3:2', ZERO00,
      ZERO00, 'u1:1', 'u0:6',
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:5:T', ZERO0000, ['u0:4:F', 'u4:7:F'],
      'u2:3:T', 'u3:2:F', ZERO0000,
      ZERO0000, 'u1:1:T', 'u0:6:T',
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      'u0', ZERO, ZERO,
      'u2', 'u0', ZERO,
      ZERO, 'u1', 'u0',
    ]);

    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });

  // 盤面に自コマがない場合、他コマの上下左右だけおける。斜めには置けないテスト。
  it('can be put on a cell next to the other pieces', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      'u0:1', ['u1:4', ZERO00], ZERO00,
      ZERO00, ['u2:3', 'u2:5'], ZERO00,
      ZERO00, [ZERO00, ZERO00], 'u1:2',
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      'u0:1:F', ['u1:4:T', ZERO0000], ZERO0000,
      ZERO0000, ['u2:3:F', 'u2:5:F'], ZERO0000,
      ZERO0000, [ZERO0000, ZERO0000], 'u1:2:F',
    ]);

    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, 'u1', ZERO,
      ZERO, INIT, ZERO,
      ZERO, ZERO, ZERO,
    ]);

    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });

  it('can flip with defalut piece', async () => {
    // Reset
    testUtil.initTestParameter();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    const putPieces = [
      ZERO00, ZERO00, 'u0:4',
      ZERO00, 'u2:2', 'u3:3',
      ZERO00, 'u1:1', ZERO00,
    ];

    const putJucgeMatches = await testUtil.setTestMatchers([
      ZERO00, ZERO0000, 'u0:4:T',
      ZERO00, 'u2:2:F', 'u3:3:T',
      ZERO00, 'u1:1:T', ZERO0000,
    ]);


    const pieceMatchers = testUtil.array2PieceMatchers([
      ZERO, ZERO, 'u0',
      ZERO, INIT, 'u3',
      ZERO, 'u1', ZERO,
    ]);

    // When
    // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
    const testMatchesDB = putJucgeMatches.filter(m => m.status === true);

    const testPieces = await testUtil.setTesPieces2(putPieces);
    const boardPieces = await testUtil.getBoardPieces('u0');

    // Then
    testPieces.forEach((result, i) => {
      expect(result).toEqual(putJucgeMatches[i]);
      expect(result).toEqual(expect.objectContaining({
        status: putJucgeMatches[i].status,
        piece: {
          x: putJucgeMatches[i].piece.x,
          y: putJucgeMatches[i].piece.y,
          userId: putJucgeMatches[i].piece.userId,
        },
      }));
    });

    expect(boardPieces.pieces).toHaveLength(pieceMatchers.length);
    expect(boardPieces.pieces).toEqual(expect.arrayContaining(pieceMatchers));

    await sleep(2000); // 2000ミリ秒待機
    const pieceData = JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    expect(pieceData).toHaveLength(testMatchesDB.length);

    // matchesから
    for (let i = 0; i < testMatchesDB.length; i += 1) {
      expect(pieceData).toContainEqual(expect.objectContaining({ piece: testMatchesDB[i].piece }));
    }
    await sendMongo.stopSendingMongo();
  });
});
