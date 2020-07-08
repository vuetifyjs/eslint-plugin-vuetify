module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: 'standard',
  rules: {
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true
    }],
    'quotes': ['error', 'single', {
      allowTemplateLiterals: true,
    }],
  }
}
