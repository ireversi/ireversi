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
  rules: {
    'no-await-in-loop': 0,
  },
  overrides: [
    {
      files: ['*.{js,vue}'],
      rules: {
        'import/no-unresolved': 0,
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['store/**/*.js'],
      rules: {
        'no-shadow': 0,
        'no-param-reassign': 0,
      },
    },
    {
      files: ['tests/**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
