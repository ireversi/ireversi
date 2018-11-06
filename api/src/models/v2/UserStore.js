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
  DeleteUserData() {
    users.length = 0;
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
  searchDuplication(userId) {
    let dup = 0;
    let flag = false;
    users.forEach((elm) => {
      if (elm.userId === userId) {
        dup += 1;
      }
    });
    if (dup > 0) {
      flag = true;
    }
    return flag;
  },
  serarchUserName(userId) {
    let ans = null;
    users.forEach((elm) => {
      if (elm.userId === userId) {
        ans = elm.username;
      }
    });
    return ans;
  },
};
