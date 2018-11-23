const chai = require('chai');
const storePlayHistory = require('../utils/storePlayHistory');
const sendMongo = require('../utils/sendMongo.js');
const PieceStore = require('../models/v2/PieceStore.js');
const UserStore = require('../models/v2/UserStore.js');
const BoardStore = require('../models/v2/BoardStore.js');
const app = require('../routes/app.js');

const basePath = '/api/v2';

async function putPieces(pieceOrder) {
  const putResult = [];
  for (let i = 0; i < pieceOrder.length; i += 1) {
    const response = await chai.request(app)
      .post(`${basePath}/piece/`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .set('Authorization', UserStore.getUserData({ userId: pieceOrder[i].userId }).accessToken)
      .send(pieceOrder[i]);
    putResult.push(response.body);
  }
  return putResult;
}

async function makePlayOrder(pieces) {
  const size = Math.sqrt(pieces.length);
  return pieces.map((p, idx) => (Array.isArray(p) ? p : [p])
    .map(u => (u === 0 ? 0 : {
      n: +u.split(':')[1],
      piece: {
        x: Math.floor(idx % size) - Math.floor(size / 2),
        y: Math.floor(idx / size) - Math.floor(size / 2),
        userId: `test${u.split(':')[0]}`,
      },
    })).filter(e => e !== 0)).filter(e => e.length !== 0)
    .reduce((acc, cv) => acc.concat(cv))
    .sort((a, b) => a.n - b.n)
    .map(p => p.piece);
}

async function makeTestMatchers(pieces) {
  const size = Math.sqrt(pieces.length);
  return pieces.map((p, idx) => (Array.isArray(p) ? p : [p])
    .map(u => (u === 0 ? 0 : {
      n: +u.split(':')[1],
      status: u.split(':')[2] === 'T',
      piece: {
        x: Math.floor(idx % size) - Math.floor(size / 2),
        y: Math.floor(idx / size) - Math.floor(size / 2),
        userId: UserStore.getUserData({ userName: `test${u.split(':')[0]}` }).userId,
      },
    })).filter(e => e !== 0)).filter(e => e.length !== 0)
    .reduce((acc, cv) => acc.concat(cv))
    .sort((a, b) => a.n - b.n)
    .map(p => ({ status: p.status, piece: p.piece }));
}


module.exports = {
  initTestParameter() {
    PieceStore.deletePieces();
    // await chai.request(app).delete(`${basePath}`);
    UserStore.deleteAllUserData();
    BoardStore.resetUserCounts();
    storePlayHistory.deleteStandbySendMongo();
    sendMongo.startSendingMongo();
  },

  array2PieceMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
      userId: p === 1 ? 1 : UserStore.getUserData({ userName: `test${p}` }).userId,
    } : p))).filter(p => p !== 0);
  },

  array2CandidateMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
    } : p))).filter(p => p !== 0);
  },

  async getBoardPieces(useName) {
    const response = await chai.request(app)
      .get(`${basePath}/board/`)
      .set('Authorization', UserStore.getUserData({ userName: `test${useName}` }).accessToken);
    return response.body;
  },

  getTestUserInfo(useName) {
    return UserStore.getUserData({ userName: `test${useName}` });
  },

  getAllTestUserInfo() {
    return UserStore.getUserData();
  },

  setTestMatchers(pieces) {
    return makeTestMatchers(pieces);
  },

  async setTestUsers(num) {
    const testUsers = [];
    for (let i = 0; i < num; i += 1) {
      const response = await chai.request(app)
        .post(`${basePath}/user_id_generate`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ userName: `testu${i}` });
      testUsers.push(response.body);
    }
    return testUsers;
  },

  async setTesPieces(pieces) {
    const pieceOrder = await makePlayOrder(pieces);
    return putPieces(pieceOrder.map(p => ({
      x: p.x,
      y: p.y,
      userId: UserStore.getUserData({ userName: p.userId }).userId,
    })));
  },
};
