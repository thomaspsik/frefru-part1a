module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'import/extensions': 0,
    'object-curly-newline': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
  },
};
