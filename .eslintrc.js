module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    semi: ['error', 'always']
  }
};
