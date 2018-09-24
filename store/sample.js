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
    const board = await this.$axios.$get('/board', {
      query: {
        user_id: 1,
      },
    });

    commit('setBoard', board);
  },
};
