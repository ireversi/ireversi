const chai = require('chai');
const jwt = require('jsonwebtoken');
const PieceStore = require('../../src/models/v2/PieceStore.js');
const array2Pieces = require('../../src/utils/array2Pieces.js');
const array2Matchers = require('../../src/utils/array2Matchers.js');
const app = require('../../src/routes/app.js');
const storePlayHistory = require('../../src/utils/storePlayHistory');
const restoreMongo = require('../../src/utils/restoreMongo.js');
const sendMongo = require('../../src/utils/sendMongo.js');

const {
  prepareDB,
  deleteAllDataFromDB,
} = require('../../src/utils/db.js');

const generateToken = require('../../src/routes/api/v2/userIdGenerate/generateToken');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const basePath = '/api/v2/piece/';

function genJwtArr(number) {
  const jwtIds = [];
  for (i = 0; i < number; i += 1) {
    const jwtElm = {};
    tempJwt = generateToken.generate();
    jwtElm.jwtId = tempJwt;
    jwtElm.decode = jwt.decode(tempJwt).userId;
    jwtIds.push(jwtElm);
  }
  return jwtIds;
}

function searchIndex(jwtIds, jwtId) {
  let ans = -1;
  jwtIds.forEach((elm, index) => {
    if (elm.decode === jwtId) {
      ans = index;
    }
  });
  return ans;
}

describe('MongoDB', () => {
  beforeAll(prepareDB);
  afterEach(deleteAllDataFromDB);

  // MongoDBのデータを残して次のテストを行う
  describe('piece', () => {
    // さらに多くのコマでテスト
    it('cannot be put on the same place3', async () => {
      // Reset
      await chai.request(app).delete(`${basePath}`);
      await PieceStore.deletePieces();
      await storePlayHistory.deleteStandbySendMongo();

      // Mongoに送信開始
      sendMongo.startSendingMongo();
      const jwtIds = genJwtArr(16);
      // Given
      // 下の配列の基の構成
      // [
      //   11:17, 10:16, 14:22, 15:23,  9:13,
      //    7:18,  4:15,  7:19, 12:20,  4:12,
      //     5:8,   4:6,   5:7,   6:9,  9:14,
      //     1:1,   2:2,   1:3, 15:24, 13:21,
      //       0  , 4:4,   5:5,  7:10,  8:11,
      // ]

      const pieces = await array2Pieces.array2Pieces(
        [
          `${jwtIds[11].decode}:17`, `${jwtIds[10].decode}:16`, `${jwtIds[14].decode}:22`, `${jwtIds[15].decode}:23`, `${jwtIds[9].decode}:13`,
          `${jwtIds[7].decode}:18`, `${jwtIds[4].decode}:15`, `${jwtIds[7].decode}:19`, `${jwtIds[12].decode}:20`, `${jwtIds[4].decode}:12`,
          `${jwtIds[5].decode}:8`, `${jwtIds[4].decode}:6`, `${jwtIds[5].decode}:7`, `${jwtIds[6].decode}:9`, `${jwtIds[9].decode}:14`,
          `${jwtIds[1].decode}:1`, `${jwtIds[2].decode}:2`, `${jwtIds[1].decode}:3`, `${jwtIds[15].decode}:24`, `${jwtIds[13].decode}:21`,
          0, `${jwtIds[4].decode}:4`, `${jwtIds[5].decode}:5`, `${jwtIds[7].decode}:10`, `${jwtIds[8].decode}:11`,
        ],
      );

      // MongoDBに送るだけの処理
      for (let i = 0; i < pieces.length; i += 1) {
        const index = searchIndex(jwtIds, pieces[i].piece.userId);
        await chai.request(app)
          .post(`${basePath}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .set('Authorization', jwtIds[index].jwtId)
          .send(pieces[i].piece);
      }
      await sleep(2700); // 3000ミリ秒待機

      // DBに送るのを一旦停止
      await sendMongo.stopSendingMongo();
      await PieceStore.deletePieces(); // 配列を空に。
      await storePlayHistory.deleteStandbySendMongo(); // Mongoに送る前の配列も空に。

      /*
      ここからサーバ・DBに再接続して、期待値を与えテストする
        */

      await chai.request(app).delete(`${basePath}`);

      // When
      // MongoDBから値を取得して、judgePieceして、Piecesに入っていく
      await restoreMongo.restoreMongo();

      const resPieces = await PieceStore.getPieces();
      await resPieces.shift(); // x:0, y:0, userId:1 を削除

      // Piecesに復元した盤面と照合するための期待値(下部でmatchesDBに再度変換)
      // 復元するときにjudgePieceしているので、めくり終えたあとの盤面を再現
      const matches = await array2Matchers.array2Matchers(
        [
          `${jwtIds[11].decode}:17`, `${jwtIds[10].decode}:16`, `${jwtIds[14].decode}:22`, `${jwtIds[15].decode}:23`, `${jwtIds[9].decode}:13`,
          `${jwtIds[7].decode}:18`, `${jwtIds[7].decode}:15`, `${jwtIds[7].decode}:19`, `${jwtIds[15].decode}:20`, `${jwtIds[9].decode}:12`,
          `${jwtIds[5].decode}:8`, `${jwtIds[7].decode}:6`, `${jwtIds[7].decode}:7`, `${jwtIds[15].decode}:9`, `${jwtIds[9].decode}:14`,
          `${jwtIds[1].decode}:1`, `${jwtIds[4].decode}:2`, `${jwtIds[7].decode}:3`, `${jwtIds[15].decode}:24`, `${jwtIds[13].decode}:21`,
          0, `${jwtIds[4].decode}:4`, `${jwtIds[5].decode}:5`, `${jwtIds[7].decode}:10`, `${jwtIds[8].decode}:11`,
        ],
      );

      // MongoDB確認のため、matchesからstatus: falseのオブジェクトを抜いた配列
      const matchesDB = matches.filter(m => m.status === true);

      // 1ピースずつ確認
      for (let i = 0; i < matchesDB.length; i += 1) {
        // Then
        expect(resPieces[i]).toEqual(matchesDB[i].piece);
      }
      expect(resPieces).toHaveLength(matchesDB.length); // x: 0, y: 0のデフォルト値を考慮
    });
  });
});
