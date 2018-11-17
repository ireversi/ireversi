// modelのrequire
const UserModel = require('./UserModel');

// すべてのuser情報を保存しておく
const users = [];

module.exports = {
  async addUserData(userData) {
    users.push(userData);
    const User = new UserModel(userData);
    await User.save();
  },
  async deleteAllUserData() {
    users.length = 0;
    const User = new UserModel();
    await User.remove();
  },
  initUserData(userMongo) {
    userMongo.forEach((elm) => {
      users.push(elm);
    });
    return true;
  },
  getUserData() {
    return users;
  },
};
