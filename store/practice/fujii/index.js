export const state = () => ({
  mypath: process.env.FUJII_PATH,
  board: null,
  number: 4,
  currentUser: 2,
  grid: 21,
  xHalf: 0, // grid描写更新変数
  yHalf: 0,
  initX: 0, // mousemove時のxHalf起点情報
  initY: 0,
  initPosX: 0, // mouseXの起点情報
  initPosY: 0,
});


export const mutations = {
  setBoard(state, board) {
    state.board = board;
  },
  zoomout(state) {
    state.grid += 2;
  },
  zoomin(state) {
    state.grid -= 2;
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
    const cellWidth = window.innerWidth / state.grid;

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
  async getBoard({ commit, state }) {
    const board = await this.$axios.$get(`${state.mypath}/board`);
    commit('setBoard', board);
  },
  async putPiece({ commit, state }, params) {
    const board = await this.$axios.$post(`${state.mypath}/playing`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    commit('setBoard', board);
  },
  async resetGame({ commit, state }, keyword) {
    const params = new URLSearchParams();
    params.append('keyword', keyword);
    await this.$axios.$delete(`${state.mypath}/playing`, { data: params });
    const board = await this.$axios.$get(`${state.mypath}/board`);
    commit('setBoard', board);
  },
};
