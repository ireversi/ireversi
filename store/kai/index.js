export const state = () => ({
  mypath: process.env.KAI_PATH,
  board: null,
  number: 16,
  grid: 15,
  currentUser: 9,
  zoomList: [-4, -2, 2, 4],
});

export const mutations = {
  setBoard(state, board) { // boardを引数に入れるのは、同期処理に行うため
    state.board = board;
  },
  postPiece(state, board) {
    state.board = board;
  },
  changeCurrentUser(state, currentUser) {
    state.currentUser = currentUser;
  },
  zoomGrid(state, n) {
    state.grid += n;
  },
};

export const actions = {
  async getBoard({ state, commit }) {
    const board = await this.$axios.$get(`${state.mypath}/board`);
    commit('setBoard', board); // actionにはcommitと覚える
  },
  async postPiece({ state, commit }, params) {
    const board = await this.$axios.$post(`${state.mypath}/playing`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    commit('postPiece', board);
  },
};
