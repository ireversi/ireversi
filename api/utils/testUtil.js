const chai = require('chai');
const storePlayHistory = require('../utils/storePlayHistory');
const sendMongo = require('../utils/sendMongo.js');
const PieceStore = require('../models/v2/PieceStore.js');
const StandbyStore = require('../models/v2/StandbyStore.js');
const UserStore = require('../models/v2/UserStore.js');
const BoardStore = require('../models/v2/BoardStore.js');
const app = require('../routes/app.js');

const { prepareDB, deleteAllDataFromDB, stopDB } = require('../utils/db.js');

const basePath = '/api/v2';

async function putPieces(pieceOrder) {
  const putResult = [];
  for (let i = 0; i < pieceOrder.length; i += 1) {
    const response = await chai
      .request(app)
      .post(`${basePath}/piece/`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', UserStore.getUserData({ userId: pieceOrder[i].userId }).accessToken)
      .send(pieceOrder[i]);
    putResult.push(response.body);
  }
  return putResult;
}

async function putFirstPieces(firstPieceOrder) {
  const putFirstResult = [];
  for (let i = 0; i < firstPieceOrder.length; i += 1) {
    const response = await chai
      .request(app)
      .post(`${basePath}/first_piece/position`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .set(
        'Authorization',
        UserStore.getUserData({ userId: firstPieceOrder[i].userId }).accessToken,
      )
      .send({ x: firstPieceOrder[i].x, y: firstPieceOrder[i].y });
    putFirstResult.push(response.body);
  }
  return putFirstResult;
}

async function setPieceDirection(directionOrder) {
  const setDirectionResult = [];
  for (let i = 0; i < directionOrder.length; i += 1) {
    const response = await chai
      .request(app)
      .post(`${basePath}/first_piece/direction`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', UserStore.getUserData({ userId: directionOrder[i].userId }).accessToken)
      .send(directionOrder[i]);
    setDirectionResult.push(response.body);
  }
  return setDirectionResult;
}

async function makePlayOrder(pieces) {
  const size = Math.sqrt(pieces.length);
  return pieces
    .map((p, idx) =>
      (Array.isArray(p) ? p : [p]).map((u) =>
        u === 0
          ? []
          : {
              n: +u.split(':')[1],
              piece: {
                x: Math.floor(idx % size) - Math.floor(size / 2),
                y: Math.floor(size / 2) - Math.floor(idx / size),
                userId: `test${u.split(':')[0]}`,
              },
            },
      ),
    )
    .reduce((acc, cv) => [...acc, ...cv])
    .filter((e) => e.length !== 0)
    .sort((a, b) => a.n - b.n)
    .map((p) => p.piece);
}

async function makeDirectionOrder(direction) {
  return direction
    .map((p) =>
      (Array.isArray(p) ? p : [p]).map((u) =>
        u === 0
          ? []
          : {
              n: +u.split(':')[1],
              order: {
                userId: `test${u.split(':')[0]}`,
                direction: u.split(':')[2],
              },
            },
      ),
    )
    .reduce((acc, cv) => [...acc, ...cv])
    .filter((e) => e.length !== 0)
    .sort((a, b) => a.n - b.n)
    .map((p) => p.order);
}

async function makeTestMatchers(pieces) {
  const size = Math.sqrt(pieces.length);
  return pieces
    .map((p, idx) =>
      (Array.isArray(p) ? p : [p]).map((u) =>
        u === 0
          ? []
          : {
              n: +u.split(':')[1],
              status: u.split(':')[2] === 'T',
              piece: {
                x: Math.floor(idx % size) - Math.floor(size / 2),
                y: Math.floor(size / 2) - Math.floor(idx / size),
                userId: UserStore.getUserData({ userName: `test${u.split(':')[0]}` }).userId,
              },
            },
      ),
    )
    .reduce((acc, cv) => [...acc, ...cv])
    .filter((e) => e.length !== 0)
    .sort((a, b) => a.n - b.n)
    .map((p) => ({ status: p.status, piece: p.piece }));
}

function isNumber(val) {
  const regex = new RegExp(/^[0-9]+$/);
  return regex.test(val);
}

module.exports = {
  prepareDB,
  deleteAllDataFromDB,
  stopDB,

  testPreProcess() {
    BoardStore.resetUserCounts();
    PieceStore.resetAllData();
    UserStore.deleteAllUserData();
    storePlayHistory.deleteStandbySendMongo();
    sendMongo.startSendingMongo();
  },

  testPostProcess() {
    sendMongo.stopSendingMongo();
  },

  array2PieceMatchers(array) {
    const size = Math.sqrt(array.length);
    return array
      .map((p, idx) =>
        p !== 0
          ? {
              x: Math.floor(idx % size) - Math.floor(size / 2),
              y: Math.floor(size / 2) - Math.floor(idx / size),
              userId: p === 1 ? 1 : UserStore.getUserData({ userName: `test${p}` }).userId,
            }
          : p,
      )
      .filter((p) => p !== 0);
  },

  array2StandbyPieceMatchers(array) {
    const size = Math.sqrt(array.length);
    return array
      .map((p, idx) =>
        p !== 0 && p !== 1
          ? {
              x: Math.floor(idx % size) - Math.floor(size / 2),
              y: Math.floor(size / 2) - Math.floor(idx / size),
              userId: UserStore.getUserData({ userName: `test${p}` }).userId,
            }
          : p,
      )
      .filter((p) => p !== 0 && p !== 1);
  },

  array2CandidateMatchers(array) {
    const size = Math.sqrt(array.length);
    return array
      .map((p, idx) =>
        p !== 0
          ? {
              x: Math.floor(idx % size) - Math.floor(size / 2),
              y: Math.floor(size / 2) - Math.floor(idx / size),
            }
          : p,
      )
      .filter((p) => p !== 0);
  },

  array2RankMatchers(array) {
    return array
      .map((p) =>
        p !== 0
          ? {
              r: +p.rank,
              topscore: {
                userId: p === 1 ? 1 : UserStore.getUserData({ userName: `test${p.user}` }).userId,
                score: +p.score,
                userName: p === 1 ? 1 : `test${p.user}`,
              },
            }
          : p,
      )
      .filter((p) => p !== 0)
      .sort((a, b) => a.n - b.n)
      .map((p) => p.topscore);
  },

  async getBoardPieces(useName) {
    const response = await chai
      .request(app)
      .get(`${basePath}/board/`)
      .set('Authorization', UserStore.getUserData({ userName: `test${useName}` }).accessToken);
    return response.body;
  },
  async getBoardHistory() {
    const boardHistory = JSON.stringify(await storePlayHistory.getBoardHistory());
    return JSON.parse(boardHistory);
  },

  async getTopScore(number, useName) {
    const response = await chai
      .request(app)
      .get(`${basePath}/topScore?number=${number}`)
      .set('Authorization', UserStore.getUserData({ userName: `test${useName}` }).accessToken);
    return response.body;
  },

  getWaitTime() {
    return StandbyStore.getWaitTime();
  },

  getTestUserInfo(useName) {
    return UserStore.getUserData({ userName: `test${useName}` });
  },

  getAllTestUserInfo() {
    return UserStore.getUserData();
  },

  // temporary
  getStandbys() {
    return PieceStore.getStandbys();
  },

  async setTestUsers(param) {
    const testUsers = [];
    if (isNumber(param)) {
      for (let i = 0; i < param; i += 1) {
        const response = await chai
          .request(app)
          .post(`${basePath}/user_id_generate`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ userName: `testu${i}` });
        testUsers.push(response.body);
      }
    } else if (Array.isArray(param)) {
      for (let i = 0; i < param.length; i += 1) {
        const response = await chai
          .request(app)
          .post(`${basePath}/user_id_generate`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ userName: param[i] });
        testUsers.push(response.body);
      }
    }
    return testUsers;
  },

  async setTesPieces(pieces) {
    const pieceOrder = await makePlayOrder(pieces);
    return putPieces(
      pieceOrder.map((p) => ({
        x: p.x,
        y: p.y,
        userId: UserStore.getUserData({ userName: p.userId }).userId,
      })),
    );
  },

  async setTestFirstPieces(pieces) {
    const pieceOrder = await makePlayOrder(pieces);
    return putFirstPieces(
      pieceOrder.map((p) => ({
        x: p.x,
        y: p.y,
        userId: UserStore.getUserData({ userName: p.userId }).userId,
      })),
    );
  },

  async setTestPieceDirections(pieces) {
    const directionOrder = await makeDirectionOrder(pieces);
    return setPieceDirection(
      directionOrder.map((p) => ({
        userId: UserStore.getUserData({ userName: p.userId }).userId,
        direction: p.direction,
      })),
    );
  },

  setTestMatchers(pieces) {
    return makeTestMatchers(pieces);
  },
};
