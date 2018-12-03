module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  plugins: ['vue'],
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
      files: ['**/tests/**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
