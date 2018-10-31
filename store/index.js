const USER_KEY_NAME = 'iReversiUserId';
const GRID_MIN = 6;
const GRID_MAX = 30;

export const state = () => ({
  pieces: null,
  candidates: null,
  standbys: null,
  size: null,
  score: 0,
  number: 4,
  currentUser: 1, // テスト用
  gridX: 10, // 縦と横比が違うため
  xHalf: 0, // grid描写更新変数
  yHalf: 0,
  initX: 0, // mousemove時のxHalf起点情報
  initY: 0,
  initDistance: 0, // ピンチ操作の基準情報
  initPosX: 0, // mouseXの起点情報
  initPosY: 0,
  initPos: { x: 0, y: 0 },
  dragFlg: false,
  touchDistance: 0,
  touchTime: 0, // ダブルタッチ無効利用変数
  userId: null,
  token: null,
});


export const plugins = [
  (store) => {
    if (process.env.NODE_ENV === 'test') return;
    const localData = localStorage.getItem(USER_KEY_NAME);
    if (localData) {
      store.commit('setAccessToken', JSON.parse(localData));
    }

    store.subscribe((mutation) => {
      if (mutation.type !== 'setAccessToken') return; // setAccessTokenの発火時のみ起動
      localStorage.setItem(USER_KEY_NAME, JSON.stringify(mutation.payload));
    });
  },
];

export const mutations = {
  setBoard(state, {
    pieces,
    candidates,
    standbys,
    size,
    score,
  }) {
    state.pieces = pieces;
    state.candidates = candidates;
    state.standbys = standbys;
    state.size = size;
    state.score = score;
  },
  zoomout(state) {
    state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX + 2));
  },
  zoomin(state) {
    state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX - 2));
  },
  changeCurrentUser(state, n) {
    state.currentUser = n;
  },
  setInitPos(state, position) {
    // 基準地点設定
    state.dragFlg = true;
    state.initPos = position;
  },
  pinchStart(state, distance) {
    // 基準距離設定
    state.dragFlg = false;
    state.initDistance = distance;
  },
  gridMove(state, position) {
    if (state.dragFlg) {
      const requestXHalf = state.initX - (position.x - state.initPos.x);
      const requestYHalf = state.initY + (position.y - state.initPos.y);
      state.xHalf = requestXHalf;
      state.yHalf = requestYHalf;

      // const arryX = [];
      // state.pieces.map(el => arryX.push(el.x));
      // const swipeMaxNumX = Math.max(...arryX) + 2;
      // if (state.xHalf >= swipeMaxNumX) {
      //   state.xHalf = swipeMaxNumX;
      // }

      // const swipeMinNumX = Math.min(...arryX) - 1;
      // if (state.xHalf <= swipeMinNumX) {
      //   state.xHalf = swipeMinNumX;
      // }
    }
  },
  pinchMove(state, distance) {
    const cellWidth = window.innerWidth / state.gridX;
    if (Math.abs(distance - state.initDistance) > cellWidth) {
      if ((distance - state.initDistance) > 0) {
        state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX - 1));
      } else if ((distance - state.initDistance) < 0) {
        state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX + 1));
      }
    }
  },
  resetInitPos(state) { // touchend
    state.initDistance = 0;
    state.dragFlg = false;
    // 次の起点場所情報の保存
    state.initX = state.xHalf;
    state.initY = state.yHalf;
    state.touchTime = new Date().getTime();
  },
  setAccessToken(state, { accessToken, userId }) {
    state.token = accessToken;
    state.userId = userId;
    // state.userName = userName:
  },
};

export const actions = {
  async getAccessToken({ commit, state }) {
    if (!state.token) {
      const userData = await this.$axios.$post('/user_id_generate');
      commit('setAccessToken', userData);
    }
  },
  async getBoard({ commit }) {
    commit('setBoard', await this.$axios.$get('/board'));
  },
  async putPiece({ dispatch }, params) {
    await this.$axios.$post('/piece', params);
    await dispatch('getBoard');
  },
  async resetGame({ dispatch }, keyword) {
    await this.$axios.$delete('/piece', { keyword });
    await dispatch('getBoard');
  },
};
