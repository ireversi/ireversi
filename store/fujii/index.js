export const state = () => ({
  mypath: process.env.FUJII_PATH,
  board: null,
  number: 4,
  currentUser: 2,
  grid: 21,
  xHalf: 0,
  yHalf: 0,
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
  async resetGame({ commit, state }) {
    const keyword = prompt('キーを入れて下さい');

    if (keyword === 'deleteAll') {
      const params = new URLSearchParams();
      params.append('keyword', keyword);
      await this.$axios.$delete(`${state.mypath}/playing`, { data: params });
      const board = await this.$axios.$get(`${state.mypath}/board`);
      commit('setBoard', board);
    }
  },
};
