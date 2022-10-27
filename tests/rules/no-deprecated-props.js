const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-props')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-props', rule, {
  valid: [
    '<template><v-btn outlined /></template>',
    '<template><v-btn :outlined="false" /></template>',
    '<template><v-btn v-bind:outlined="false" /></template>',
    // https://github.com/vuetifyjs/eslint-plugin-vuetify/issues/35
    '<template><v-btn v-bind="" /></template>',
  ],

  invalid: [
    {
      code: '<template><v-btn outline /></template>',
      output: '<template><v-btn outlined /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-btn :outline="false" /></template>',
      output: '<template><v-btn :outlined="false" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-btn v-bind:outline="false" /></template>',
      output: '<template><v-btn v-bind:outlined="false" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-data-iterator content-class="foo" /></template>',
      output: '<template><v-data-iterator content-class="foo" /></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><v-toolbar app /></template>',
      output: '<template><v-toolbar app /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
