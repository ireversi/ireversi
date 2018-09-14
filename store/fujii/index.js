export const state = () => ({
  counter: 0,
  mypath: process.env.FUJII_PATH,
  board: null,
  number: 4,
  currentUser: 1,
  grid: 21,
});

export const mutations = {
  increment(state) {
    state.counter += 1;
  },
  setBoard(state, board) {
    state.board = board;
  },
  zoomout(state) {
    state.grid += 2;
  },
  zoomin(state) {
    state.grid -= 2;
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
};
