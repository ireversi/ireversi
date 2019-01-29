const jwt = require('jsonwebtoken');
const UserStore = require('../../src/models/v2/UserStore');
const generateToken = require('../../src/routes/api/v2/userIdGenerate/generateToken');

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

describe('users', () => {
  // 初期化
  UserStore.deleteAllUserData();

  // 1プレイヤー分登録する。
  it('can get and add userData', async () => {
    // Given
    const jwt1 = generateToken.generate();
    const id1 = jwt.decode(jwt1).userId;
    const userName1 = 'testname';
    UserStore.addUserData({
      accessToken: jwt1,
      userId: id1,
      userName: userName1,
    });
    await sleep(2000);
    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    // const response = UserStore.getUserData();
    const response = JSON.parse(JSON.stringify(await UserStore.getUserData()));
    // Then
    expect(response[0].accessToken).toEqual(jwt1);
    expect(response[0].userId).toEqual(id1);
    expect(response[0].userName).toEqual(userName1);
  });

  // 次のプレイヤー分登録する。
  it('can get and add userData 2nd', async () => {
    // Given
    const jwt2 = generateToken.generate();
    const id2 = jwt.decode(jwt2).userId;
    const userName2 = 'testname2';
    UserStore.addUserData({
      accessToken: jwt2,
      userId: id2,
      userName: userName2,
    });
    // await Promise.all(matchers.map(m => PieceModel(m).save()));
    // When
    const response = JSON.parse(JSON.stringify(await UserStore.getUserData()));
    // Then
    expect(response[1].accessToken).toEqual(jwt2);
    expect(response[1].userId).toEqual(id2);
    expect(response[1].userName).toEqual(userName2);
  });
});
