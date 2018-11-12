const PieceStore = require('./PieceStore.js');
const calcScore = require('../../routes/api/v2/board/calcScore.js');

const onlineUsers = [];
let userCounts = 0;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

(async () => {
  // eslint-disable-next-line
  while (true) {
    userCounts = onlineUsers.length;
    onlineUsers.length = 0;
    await sleep(2000);
  }
})();

module.exports = {
  getBoard(userId) {
    const pieces = PieceStore.getPieces();
    const candidates = PieceStore.getCandidates();
    const standbys = PieceStore.getStandbys();
    const score = calcScore.calc(userId, pieces);
    const size = PieceStore.getSize();
    if (onlineUsers.indexOf(userId) === -1) {
      onlineUsers.push(userId);
    }
    return {
      pieces,
      candidates,
      standbys,
      score,
      size,
      userCounts,
    };
  },
  resetUserCounts() {
    onlineUsers.length = 0;
    userCounts = 0;
  },
};
