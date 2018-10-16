export const state = () => ({
  pieces: null,
  candidates: null,
  standbys: null,
  size: null,
  score: 0,
  number: 4,
  currentUser: 1,
  gridX: 10,
  gridY: 10,
  xHalf: 0, // grid描写更新変数
  yHalf: 0,
  initX: 0, // mousemove時のxHalf起点情報
  initY: 0,
  initLen: 0, // ピンチ操作の基準情報
  initPosX: 0, // mouseXの起点情報
  initPosY: 0,
  dragFlg: false,
});


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
    state.gridX += 2;
    state.gridY += 2;
  },
  zoomin(state) {
    state.gridX -= 2;
    state.gridY -= 2;
  },
  changeCurrentUser(state, n) {
    state.currentUser = n;
  },
  moveRight(state) {
    state.xHalf += 1;
  },
  moveLeft(state) {
    state.xHalf -= 1;
  },
  moveUp(state) {
    state.yHalf += 1;
  },
  moveDown(state) {
    state.yHalf -= 1;
  },
  setInitPos(state, e) { // touchstart
    console.log(e.changedTouches);
    // if (e.changedTouches && e.changedTouches.length >= 2) {
    //   state.initLen = e.changedTouches[1].clientX - e.changedTouches[0].clientX;
    // } else {
    state.dragFlg = true;
    state.initPosX = e.pageX || e.changedTouches[0].clientX;
    state.initPosY = e.pageY || e.changedTouches[0].clientY;
    console.log(`${state.initPosX}, ${state.initPosY}`);
    // }
  },
  gridMove(state, e) { // touchsmove
    console.log(e.changedTouches);
    const cellWidth = window.innerWidth / state.gridX;
    // if (state.dragFlg) {
    const mouseX = e.pageX || e.changedTouches[0].clientX;
    const mouseY = e.pageY || e.changedTouches[0].clientY;
    const requestXHalf = state.initX - Math.floor((mouseX - state.initPosX) / cellWidth);
    const requestYHalf = state.initY + Math.floor((mouseY - state.initPosY) / cellWidth);
    if (requestXHalf >= state.size.xMin + (state.gridX / 2) - 2
      && requestXHalf <= state.size.xMax - (state.gridX / 2) + 3) {
      state.xHalf = requestXHalf;
    }
    if (requestYHalf >= state.size.yMin + state.gridY - 1
      && requestYHalf <= state.size.yMax - (state.gridY / 2) + 2) {
      state.yHalf = requestYHalf;
    }
    // } else if (state.initLen) {
    //   const nowLen = e.changedTouches[1].clientX - e.changedTouches[0].clientX;
    //   state.gridX += Math.floor(nowLen / cellWidth);
    //   state.gridY += Math.floor(nowLen / cellWidth);
    // }
    console.log(`${state.xHalf}, ${state.yHalf}`);
  },
  resetInitPos(state) { // touchend
    console.log('resetInit');
    state.initLen = 0;
    state.dragFlg = false;
    // 次の起点場所情報の保存
    state.initX = state.xHalf;
    state.initY = state.yHalf;
  },
};

export const actions = {
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
