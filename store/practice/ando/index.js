export const state = () => ({
  counter: 0,
  mypath: process.env.ANDO_PATH,
  board: null,
  grid: 35,
  number: 16,
  currentUser: 1,
  colors: [],
  colorList: ['#f00', '#0f0', '#00f', '#fff'],
  currentColorIndex: 2,
  centerPosition: { x: 0, y: 0 },
});

export const mutations = {
  moveUp(state) {
    state.centerPosition.y += 1;
  },
  moveRight(state) {
    state.centerPosition.x += 1;
  },
  moveDown(state) {
    state.centerPosition.y -= 1;
  },
  moveLeft(state) {
    state.centerPosition.x -= 1;
  },
  zoomOut(state) {
    state.grid += 2;
  },
  zoomIn(state) {
    state.grid -= 2;
  },
  setBoard(state, board) {
    state.board = board;
    for (let i = 0; i < state.$axiosgrid ** 2; i += 1) {
      state.colors.push('#fff');
    }
  },
  changeCurrentUser(state, index) {
    state.currentUser = index;
  },
  changeColorIndex(state, index) {
    state.currentColorIndex = index;
  },
  changeColor(state, i) {
    const newColors = [...state.colors];
    newColors[i] = state.colorList[state.currentColorIndex];
    state.colors = newColors;
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
