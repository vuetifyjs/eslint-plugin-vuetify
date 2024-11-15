const neostandard = require('neostandard')

module.exports = [
  ...neostandard(),
  {
    rules: {
      'no-template-curly-in-string': 'off',

      '@stylistic/quotes': ['error', 'single', {
        allowTemplateLiterals: true,
      }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline',
      }],
    }
  }
]
