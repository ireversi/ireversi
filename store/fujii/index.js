// State部分
export const state = () => ({
  colorList: [
    '#d00',
    '#cc0',
    '#0cc',
    '#0c0',
    '#c0c',
  ],
});

// ページ初期化時に一回だけ呼ばれる
export const plugins = () => ({});


// index.vue の methods.onMove 内で使用している。メソッドスタイルgetterの書き方より使い方を意識する
// https://vuex.vuejs.org/ja/guide/getters.html#%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9
export const getters = () => ({});

// stateは「必ず」mutationsの関数を通して更新する
// 呼び出しは $store.commit('関数名', 必要なら引数);
// mutationsに非同期処理を書いてはならない
// 非同期処理はactionを経由してmutationを呼ぶ
export const mutations = {
};

// axiosなど非同期処理を挟んでstateを更新したい場合に使う
// 呼び出しは$store.dispatch('関数名', 必要なら引数)
// actionsの中で$store.commit を呼んでstateを更新する
export const actions = {
};

// ストアの外でデータの書き換えをするための設定
// https://github.com/nuxt/nuxt.js/issues/1917
// export const strict = false
