module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'metarhia',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'arrow-parens': 0,
    indent: 0,
  },
};
