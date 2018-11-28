const testUtil = require('../../../../../src/utils/testUtil');

describe('userId generate', () => {
  // set DB
  beforeAll(testUtil.prepareDB);
  afterEach(testUtil.deleteAllDataFromDB);
  afterAll(testUtil.stopDB);

  // 一つ駒を置く
  it('generates userId and request userName', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userNumber = 10;
    await testUtil.setTestUsers(userNumber);

    // When
    const testUsers = testUtil.getAllTestUserInfo();

    // Then
    expect(testUsers.length).toEqual(userNumber);

    // Finish
    testUtil.testPostProcess();
  });

  it('generates userId and request special userName', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userList = [
      'testuser1',
      'testuser2',
      'testuser3',
      'testuser4',
      'testuser5',
    ];
    await testUtil.setTestUsers(userList);

    // When
    const testUsers = testUtil.getAllTestUserInfo();

    // Then
    expect(testUsers.length).toEqual(userList.length);

    // Finish
    testUtil.testPostProcess();
  });

  it('generates userId and request invalid userName', async () => {
    // Reset
    testUtil.testPreProcess();

    // Given
    const userList = [
      'TestUser',
      'test-user',
    ];
    await testUtil.setTestUsers(userList);

    // When
    const testUsers = testUtil.getAllTestUserInfo();

    // Then
    expect(testUsers.length).toEqual(0);

    // Finish
    testUtil.testPostProcess();
  });
});
