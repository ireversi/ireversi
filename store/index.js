export const state = () => ({
  pieces: null,
  candidates: null,
  standbys: null,
  number: 4,
  currentUser: 1,
  gridX: 10,
  gridY: 10,
  xHalf: 0, // grid描写更新変数
  yHalf: 0,
  initX: 0, // mousemove時のxHalf起点情報
  initY: 0,
  initPosX: 0, // mouseXの起点情報
  initPosY: 0,
});


export const mutations = {
  setBoard(state, { pieces, candidates, standbys }) {
    state.pieces = pieces;
    state.candidates = candidates;
    state.standbys = standbys;
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
    state.initPosX = e.changedTouches[0].clientX;
    state.initPosY = e.changedTouches[0].clientY;
  },
  gridMove(state, e) { // touchsmove
    const mouseX = e.changedTouches[0].clientX;
    const mouseY = e.changedTouches[0].clientY;
    const cellWidth = window.innerWidth / state.gridX;

    state.xHalf = state.initX - Math.floor((mouseX - state.initPosX) / cellWidth);
    state.yHalf = state.initY + Math.floor((mouseY - state.initPosY) / cellWidth);
  },
  resetInitPos(state) { // touchend
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
