export const state = () => ({
  counter: 0,
  mypath: process.env.ANDO_PATH,
  board: null,
});

// 同期的にstateを変更したいときは必ずmutations経由で行う
// 非同期処理は出来ない->外部から渡す
export const mutations = {
  increment(state) {
    state.counter += 1;
  },
  setBoard(state, board) {
    state.board = board;
  },
};

// 非同期処理
export const actions = {
  // async getBoard(store) {
  //   const board = await this.$axios.$get(`${store.state.mypath}/board`);
  //   store.commit('setBoard', board);
  // },
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
    console.log('test');
    commit('setBoard', board);
  },
};
