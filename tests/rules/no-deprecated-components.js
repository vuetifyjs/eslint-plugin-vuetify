const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-components')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-components', rule, {
  valid: [
    '<template><v-container /></template>',
  ],
  invalid: [
    {
      code: '<template><v-content /></template>',
      output: '<template><v-main /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-jumbotron /></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><v-subheader /></template>',
      output: '<template><v-subheader /></template>',
      errors: [{ messageId: 'replacedWithCustom' }],
    },
  ],
})
