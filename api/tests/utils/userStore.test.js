const jwt = require('jsonwebtoken');
const UserStore = require('../../src/models/v2/UserStore');
const generateToken = require('../../src/routes/api/v2/userIdGenerate/generateToken');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

describe('users', () => {
  // 初期化
  UserStore.deleteAllUserData();

  // 1プレイヤー分登録する。
  it('can get and add userData', async () => {
    // Given
    jwt1 = generateToken.generate();
    id1 = jwt.decode(jwt1).userId;
    username1 = 'testname';
    UserStore.addUserData({
      accessToken: jwt1,
      userId: id1,
      username: username1,
    });
    await sleep(2000);
    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    // const response = UserStore.getUserData();
    const response = JSON.parse(JSON.stringify(await UserStore.getUserData()));
    // Then
    expect(response[0].accessToken).toEqual(jwt1);
    expect(response[0].userId).toEqual(id1);
    expect(response[0].username).toEqual(username1);
  });


  // 次のプレイヤー分登録する。
  it('can get and add userData 2nd', async () => {
    // Given
    jwt2 = generateToken.generate();
    id2 = jwt.decode(jwt1).userId;
    username2 = 'testname2';
    UserStore.addUserData({
      accessToken: jwt2,
      userId: id2,
      username: username2,
    });
    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    const response = JSON.parse(JSON.stringify(await UserStore.getUserData()));
    // Then
    expect(response[1].accessToken).toEqual(jwt2);
    expect(response[1].userId).toEqual(id2);
    expect(response[1].username).toEqual(username2);
  });
});
