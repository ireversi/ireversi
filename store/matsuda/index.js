export const state = () => ({
  mypath: process.env.MATSUDA_PATH,
  board: null,
});

export const mutations = {
  setBoard(state, board) {
    state.board = board;
  },
};

export const actions = {
  async getBoard({ state, commit }) {
    const board = await this.$axios.$get(`${state.mypath}/board`);
    commit('setBoard', board);
  },
  async putPiece({ state, commit }, params) {
    const board = await this.$axios.$post(`${state.mypath}/piece`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    commit('setBoard', board);
  },
};
