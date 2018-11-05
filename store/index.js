const USER_KEY_NAME = 'iReversiUserId';
const GRID_MIN = 5;
const GRID_MAX = 101;
const DEFAULT_GRID_X = 11;
const TOPSCORES = 5;

export const state = () => ({
  userId: null,
  userName: null,
  token: null,
  pieces: null,
  candidates: null,
  standbys: null,
  size: null,
  score: 0,
  gridX: DEFAULT_GRID_X, // Expect: Integer
  moveDist: { x: 0, y: 0 }, // 原点の移動量
  swipeInit: { x: 0, y: 0 }, // swipe基準点
  dragInit: { x: 0, y: 0 }, // drag基準点
  pinchInit: 0, // pinch基準距離
  touchTime: 0, // ダブルタッチ無効判定に使用
  dragFlg: false,
  topScores: [],
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
  zoomout(state, { targetPos, adjustPos }) {
    if (state.gridX + 1 >= GRID_MIN && state.gridX + 1 <= GRID_MAX) {
      // gridX変更分位置調整
      state.moveDist.x -= (window.innerWidth * targetPos.x) / (state.gridX * (state.gridX + 1))
      // piece中心とカーソル位置との差分調整
                          + adjustPos.x * (state.gridX / (state.gridX + 1));
      // gridX変更分位置調整調整
      state.moveDist.y -= (window.innerWidth * targetPos.y) / (state.gridX * (state.gridX + 1))
      // piece中心とカーソル位置との差分調整
                          + adjustPos.y * (state.gridX / (state.gridX + 1));
    }
    state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX + 1));
  },
  zoomin(state, { targetPos, adjustPos }) {
    if (state.gridX - 1 >= GRID_MIN && state.gridX - 1 <= GRID_MAX) {
      // gridX変更分位置調整
      state.moveDist.x += (window.innerWidth * targetPos.x) / (state.gridX * (state.gridX - 1))
      // piece中心とカーソル位置との差分調整
                          - adjustPos.x * (state.gridX / (state.gridX - 1));
      // gridX変更分位置調整
      state.moveDist.y += (window.innerWidth * targetPos.y) / (state.gridX * (state.gridX - 1))
      // piece中心とカーソル位置との差分調整
                          - adjustPos.y * (state.gridX / (state.gridX - 1));
    }
    state.gridX = Math.max(GRID_MIN, Math.min(GRID_MAX, state.gridX - 1));
  },
  setInitPos(state, position) {
    // 基準地点設定
    state.dragFlg = true;
    state.dragInit = position;
    state.swipeInit.x = state.moveDist.x;
    state.swipeInit.y = state.moveDist.y;
  },
  pinchStart(state, distance) {
    // 基準距離設定
    state.dragFlg = false;
    state.pinchInit = distance;
  },
  gridMove(state, position) {
    if (state.dragFlg) {
      const requestXHalf = state.swipeInit.x - (position.x - state.dragInit.x);
      const requestYHalf = state.swipeInit.y + (position.y - state.dragInit.y);
      state.moveDist.x = requestXHalf;
      state.moveDist.y = requestYHalf;

      // const arryX = [];
      // state.pieces.map(el => arryX.push(el.x));
      // const swipeMaxNumX = Math.max(...arryX) + 2;
      // if (state.moveDist.x >= swipeMaxNumX) {
      //   state.moveDist.x = swipeMaxNumX;
      // }

      // const swipeMinNumX = Math.min(...arryX) - 1;
      // if (state.moveDist.x <= swipeMinNumX) {
      //   state.moveDist.x = swipeMinNumX;
      // }
    }
  },
  resetInitPos(state) { // touchend
    state.pinchInit = 0;
    state.dragFlg = false;
    state.touchTime = new Date().getTime();
  },
  setAccessToken(state, { accessToken, userId, userName }) {
    state.token = accessToken;
    state.userId = userId;
    state.userName = userName;
  },
  setTopScores(state, scores) {
    const copiedTopScores = [...state.topScores];
    for (let i = 0; i < TOPSCORES; i += 1) {
      copiedTopScores[i] = {};
      copiedTopScores[i].userId = scores[i] ? scores[i].userId : '-';
      copiedTopScores[i].score = scores[i] ? scores[i].score : 0;
    }
    state.topScores = copiedTopScores;
  },
};

export const actions = {
  async getAccessToken({ commit, state }, username) {
    if (!state.token) {
      const userData = await this.$axios.$post('/user_id_generate', { username });
      commit('setAccessToken', userData);
    }
  },
  async getBoard({ commit }) {
    const response = await this.$axios.$get('/board');
    commit('setBoard', response);
  },
  async putPiece({ dispatch }, params) {
    await this.$axios.$post('/piece', params);
    await dispatch('getBoard');
  },
  async resetGame({ dispatch }, keyword) {
    await this.$axios.$delete('/piece', { keyword });
    await dispatch('getBoard');
  },
  async getTopScores({ commit }) {
    const topScores = await this.$axios.$get(`/topScore?number=${TOPSCORES}`);
    commit('setTopScores', topScores);
  },
  pinchMove({ state, commit }, { distance, targetPos, adjustPos }) {
    const cellWidth = window.innerWidth / state.gridX;

    if (Math.abs(distance - state.pinchInit) > cellWidth) {
      if ((distance - state.pinchInit) > 0) {
        commit('zoomin', { targetPos, adjustPos });
      } else if ((distance - state.pinchInit) < 0) {
        commit('zoomout', { targetPos, adjustPos });
      }
    }
  },
};
