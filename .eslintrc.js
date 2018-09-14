module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'airbnb-base',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {},
  overrides: [
    {
      files: ['*.{js,vue}'],
      rules: {
        'import/no-unresolved': false,
        'import/no-extraneous-dependencies': false,
      },
    },
  ],
  globals: {
    // Jest's variables
    jest: false,
    jestTimeout: false,
    beforeAll: false,
    afterAll: false,
    test: false,
    it: false,
    expect: false,
  },
};
