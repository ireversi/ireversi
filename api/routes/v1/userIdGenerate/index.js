const router = require('express').Router();
const jwt = require('jsonwebtoken');
const generateToken = require('./generateToken.js');
const UserStore = require('../../../models/v1/UserStore.js');

router.route('/').post((req, res) => {
  const ans = {};
  const accessToken = generateToken.generate();
  const { userId } = jwt.decode(accessToken);
  const { userName } = req.body;

  // 正規表現でuserNameのvalidation
  // 数値、アルファベット、_以外が出たらtrueを返す正規表現
  const reg = /^[a-z0-9]([_a-z0-9]){2,13}[a-z0-9]$/;

  // 禁止文字の検索、最短の検索、最長の検索
  if (reg.test(userName) && userName !== null && userName !== undefined) {
    ans.accessToken = accessToken;
    ans.userId = userId;
    ans.userName = userName;
    UserStore.addUserData(ans);
  } else {
    ans.accessToken = null;
    ans.userId = null;
    ans.userName = null;
  }
  res.json(ans);
});

module.exports = router;
