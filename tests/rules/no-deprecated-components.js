const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-components')

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    parser: require('vue-eslint-parser'),
  },
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
