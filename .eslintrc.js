module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['airbnb-base', 'plugin:vue/essential', 'plugin:prettier/recommended'],
  plugins: ['vue', 'prettier'],
  rules: {
    'no-await-in-loop': 'off',
  },
  overrides: [
    {
      files: ['*.{js,vue}'],
      rules: {
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['store/**/*.js'],
      rules: {
        'no-shadow': 'off',
        'no-param-reassign': 'off',
      },
    },
    {
      files: ['**/tests/**/*.test.js', 'api/tests/config.js'],
      env: {
        jest: true,
      },
    },
  ],
};
