module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: 'standard',
  rules: {
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    }],
    quotes: ['error', 'single', {
      allowTemplateLiterals: true,
    }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
  },
}
