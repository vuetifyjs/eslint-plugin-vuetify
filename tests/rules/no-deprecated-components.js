const tester = require('../setup').tester
const rule = require('../../src/rules/no-deprecated-components')

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
      output: null,
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
