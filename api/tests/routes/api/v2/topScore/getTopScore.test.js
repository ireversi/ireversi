const chai = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../../../../../src/routes/app.js');
const PieceStore = require('../../../../../src/models/v2/PieceStore.js');
const generateToken = require('../../../../../src/routes/api/v2/userIdGenerate/generateToken.js');
const UserStore = require('../../../../../src/models/v2/UserStore');

const basePath = '/api/v2';
const zero = 0;

function searchUserName(userId) {
  const users = UserStore.getUserData();
  let username = 'origin';
  users.forEach((elm) => {
    if (elm.userId === userId) {
      username = elm.userName;
    }
  });
  return username;
}

function userIdGenerate(userName) {
  const token = generateToken.generate();
  UserStore.addUserData({
    accessToken: token,
    userId: jwt.decode(token).userId,
    userName,
  });
  return token;
}

const jwtDecode = token => jwt.decode(token);

async function convertRanking(result, number) {
  const scores = [];
  // まずはuserIdの重複しないリストを作成
  // userIdの重複削除
  const ids = new Set(result);
  const idsArr = [...ids];
  // ゼロを削除
  const idx = idsArr.indexOf(0);
  if (idx !== -1) {
    idsArr.splice(idx, 1);
  }
  // userIdの各々について検索。score計算。
  idsArr.forEach((elm) => {
    let score = 0;
    const userName = searchUserName(elm);
    result.forEach((cnt) => {
      if (elm === cnt) {
        score += 1;
      }
    });
    const idscore = {
      userId: elm,
      score,
      userName,
    };
    scores.push(idscore);
  });

  // scoresの並び替え
  const sortedScores = scores.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });
  const rank = number;
  const slicedScores = sortedScores.slice(0, rank);

  return slicedScores;
}

describe('score', () => {
  // beforeAll(prepareDB);
  // afterEach(deleteAllDataFromDB);

  // 一つ駒を置く
  it('gets score', async () => {
    await chai.request(app).delete(basePath);
    PieceStore.initPieces();

    // Given
    const id1 = jwtDecode(userIdGenerate('test1')).userId;
    const id2 = jwtDecode(userIdGenerate('test2')).userId;
    const id3 = jwtDecode(userIdGenerate('test3')).userId;
    const id4 = jwtDecode(userIdGenerate('test4')).userId;
    const id5 = jwtDecode(userIdGenerate('test5')).userId;
    const id6 = jwtDecode(userIdGenerate('test6')).userId;
    const id7 = jwtDecode(userIdGenerate('test7')).userId;
    const id8 = jwtDecode(userIdGenerate('test8')).userId;

    // "I"は初期化した時の最初のピース
    // 1:13,2:4,3:5,4:4,5:2,6:2,7:4,8:1
    const result = [
      'I', id1, id1, id1, id1, zero,
      id1, id1, id2, id2, id2, id2,
      id1, id3, id3, id3, zero, id4,
      id4, id4, zero, id3, id5, id5,
      id1, zero, id8, id1, zero, id6,
      id1, id7, id7, zero, id7, id6,
    ];
    // 上位何名まで反映するか
    const number = 5;

    const size = Math.sqrt(result.length);
    result.forEach((elm, index) => {
      if (elm !== 0) {
        const ans = {
          x: Math.floor(index % size),
          y: Math.floor(index / size),
          userId: elm,
        };
        PieceStore.addPiece(ans);
      }
    });
    const matchers = await convertRanking(result, number);

    const id1Jwt = userIdGenerate('test');

    // When
    const response = await chai.request(app)
      .get(`${basePath}/topScore`)
      .query({ number })
      .set('Authorization', id1Jwt);

    // Then
    expect(response.body).toEqual(expect.arrayContaining(matchers));
  });
});
