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
  // getUserData() {
  getUserData(user) {
    if (user === undefined) {
      return users;
    }
    if (user.userId) {
      return users.find((u) => u.userId === user.userId);
    }
    if (user.userName) {
      return users.find((u) => u.userName === user.userName);
    }
    if (user.accessToken) {
      return users.find((u) => u.accessToken === user.accessToken);
    }
    return null;
    // return users;
  },
};
