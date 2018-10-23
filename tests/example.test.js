const { getStore } = require('./setup.js');

describe('Example: Vuex test', () => {
  let store;

  beforeEach(async () => {
    store = await getStore();
  });

  it('Get state', () => {
    // Given
    const { grid } = store.state.practice.fujii.index;

    // When
    store.commit('practice/fujii/index/zoomout');

    // Then
    expect(store.state.practice.fujii.index.grid).toBe(grid + 2);
  });
});


// swipe機能テスト
// 3秒ローディングアイコンカウントテスト
// レーザーテスト(座標方向データ取得テスト)
// スコアカウントテスト
