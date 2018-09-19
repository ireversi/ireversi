

export const state = () => ({
  mypath: process.env.KIDO_PATH,
  board: null,
  grid: 23,
  number: 8,
  currentUser: 1,
});

export const mutations = {
  setBoard(state, board) {
    state.board = board;
  },
  zoomIn(state, grid) {
    state.grid = grid - 2;
  },
  zoomOut(state, grid) {
    state.grid = grid + 2;
  },
  changeCurrentUser(state, currentUser) {
    state.currentUser = currentUser;
  },
};

export const actions = {
  async getBoard({ state, commit }) {
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
};
