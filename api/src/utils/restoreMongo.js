const BoardHistoryModel = require('../models/v2/BoardHistoryModel.js');
const PieceStore = require('../models/v2/PieceStore.js');

const propFilter = '-__v';
const restore = true;

module.exports = {
  async restoreMongo() {
    const mg = await JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));
    // console.log(mg);

    // Mongoのデータが日付順に格納されているとは限らないため並び替え
    // eslint-disable-next-line
    await mg.sort((a, b) => (a._id.substr(8, 16) > b._id.substr(8, 16) ? 1 : -1));

    for (let i = 0; i < mg.length; i += 1) {
      const { x, y, userId } = mg[i].piece;
      await PieceStore.judgePiece(x, y, userId, restore);
    }
  },
};
