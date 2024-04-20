const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/icon-button-variant')

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    parser: require('vue-eslint-parser'),
  },
})

tester.run('icon-button-variant', rule, {
  valid: [
    '<template><v-btn /></template>',
    '<template><v-btn variant="text" /></template>',
    '<template><v-btn icon variant="text" /></template>',
    '<template><v-btn icon="foo" variant="text" /></template>',
  ],
  invalid: [
    {
      code: '<template><v-btn icon /></template>',
      output: '<template><v-btn icon variant="text" /></template>',
      errors: [{ messageId: 'needsVariant' }],
    },
    {
      code: '<template><v-btn icon="foo" /></template>',
      output: '<template><v-btn icon="foo" variant="text" /></template>',
      errors: [{ messageId: 'needsVariant' }],
    },
  ],
})
