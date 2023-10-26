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
    {
      code: '<template><v-list-item-avatar /></template>',
      output: '<template><v-list-item-avatar /></template>',
      errors: [{ messageId: 'replacedWithCustom' }],
    },
    {
      code: '<template><v-list-item-icon /></template>',
      output: '<template><v-list-item-icon /></template>',
      errors: [{ messageId: 'replacedWithCustom' }],
    },
    {
      code: '<template><v-list-item><v-list-item-content><v-list-item-title /></v-list-item-content></v-list-item></template>',
      output: '<template><v-list-item><v-list-item-title /></v-list-item></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><v-list-item><v-list-item-content></v-list-item-content></v-list-item></template>',
      output: '<template><v-list-item></v-list-item></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><v-list-item><v-list-item-content class="foo"><v-list-item-title /></v-list-item-content></v-list-item></template>',
      errors: [{ messageId: 'removed' }],
    },
  ],
})
