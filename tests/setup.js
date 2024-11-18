const { RuleTester } = require(process.env.ESLINT8 ? 'eslint8' : 'eslint')

const tester = new RuleTester(
  process.env.ESLINT8
    ? {
        parser: require.resolve('vue-eslint-parser'),
        parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      }
    : {
        languageOptions: {
          parser: require('vue-eslint-parser'),
          ecmaVersion: 2015,
        },
      }
)

module.exports = { tester }
