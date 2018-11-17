const chai = require('chai');
const PieceStore = require('../models/v2/PieceStore.js');
const UserStore = require('../models/v2/UserStore.js');
const BoardStore = require('../models/v2/BoardStore.js');
const app = require('../routes/app.js');

const basePath = '/api/v2';

module.exports = {
  initTestParameter() {
    PieceStore.deletePieces();
    UserStore.deleteAllUserData();
    BoardStore.resetUserCounts();
  },

  array2PieceMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
      userId: p,
    } : p))).filter(p => p !== 0);
  },

  array2CandidateMatchers(array) {
    const size = Math.sqrt(array.length);
    return (array.map((p, idx) => (p !== 0 ? {
      x: Math.floor(idx % size) - Math.floor(size / 2),
      y: Math.floor(idx / size) - Math.floor(size / 2),
    } : p))).filter(p => p !== 0);
  },

  setTesPieces(pieces) {
    const size = Math.sqrt(pieces.length);
    pieces.forEach((p, idx) => {
      if (p !== 0) {
        PieceStore.addPiece({
          x: Math.floor(idx % size) - Math.floor(size / 2),
          y: Math.floor(idx / size) - Math.floor(size / 2),
          userId: p,
        });
      }
    });
  },

  async setTestUsers(num) {
    const testUsers = [];
    for (let i = 0; i < num; i += 1) {
      const username = `test${String(i)}`;
      const response = await chai.request(app)
        .post(`${basePath}/user_id_generate`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username });
      testUsers.push(response.body);
    }
    return testUsers;
  },
};
