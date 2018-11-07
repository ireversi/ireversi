const BoardHistoryModel = require('../models/v2/BoardHistoryModel.js');
const UserModel = require('../models/v2/UserModel');
const PieceStore = require('../models/v2/PieceStore.js');
const UserStore = require('../models/v2/UserStore');


const propFilter = '-__v';
const restore = true;

module.exports = {
  async restoreMongo() {
    const mg = await JSON.parse(JSON.stringify(await BoardHistoryModel.find({}, propFilter)));

    // Mongoのデータが日付順に格納されているとは限らないため並び替え
    // eslint-disable-next-line
    mg.sort((a, b) => (a._id > b._id ? 1 : -1));

    for (let i = 0; i < mg.length; i += 1) {
      const { x, y, userId } = mg[i].piece;
      PieceStore.judgePiece(x, y, userId, restore);
    }
  },
  async restoreUserMongo() {
    // const usersMongo = await JSON.parse(JSON.stringify(await UserModel.find({})));
    const usersMongo = await JSON.parse(JSON.stringify(await UserModel.find({}, propFilter)));
    await UserStore.initUserData(usersMongo);
  },
};
