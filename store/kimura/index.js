export const state = () => ({
  counter: 0,
  mypath: process.env.KIMURA_PATH,
  board: null,
  grid: 15,
  UserList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  currentUserIndex: 1,
  xSlide: 0,
  ySlide: 0,
});

export const mutations = {
  increment(state) {
    state.counter += 1;
  },
  setBoard(state, board) {
    state.board = board;
  },
  changeUserIndex(state, index) {
    state.currentUserIndex = index;
  },
  zoomIn(state) {
    state.grid -= 3;
  },
  zoomOut(state) {
    state.grid += 3;
  },
  slideUp(state) {
    state.ySlide -= 3;
  },
  slideRight(state) {
    state.xSlide += 3;
  },
  slideDown(state) {
    state.ySlide += 3;
  },
  slideLeft(state) {
    state.xSlide -= 3;
  },
};

export const actions = {
  async getBoard({ state, commit }) {
    const board = await this.$axios.$get(`${state.mypath}/board`);
    commit('setBoard', board);
  },
  async putsPiece({ state, commit }, params) {
    const board = await this.$axios.$post(`${state.mypath}/piece`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    commit('setBoard', board);
  },
};
