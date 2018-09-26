export const state = () => ({
  board: null,
});

export const mutations = {
  setBoard(state, board) {
    state.board = board;
  },
};

export const actions = {
  async getBoard({ commit }) {
    const board = await this.$axios.$get('/board');
    commit('setBoard', board);
  },
};
