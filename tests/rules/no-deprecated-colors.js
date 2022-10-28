const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-colors')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-colors', rule, {
  valid: [
    '<template><div color="" /></template>',
    '<template><div color="red" /></template>',
    '<template><div color="red-darken-2" /></template>',
    '<template><div class="bg-red" /></template>',
    '<template><div class="bg-red-darken-2" /></template>',
  ],
  invalid: [
    {
      code: '<template><div color="red darken-2" /></template>',
      output: '<template><div color="red-darken-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="red" /></template>',
      output: '<template><div class="bg-red" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="red darken-2" /></template>',
      output: '<template><div class="bg-red-darken-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="red--text" /></template>',
      output: '<template><div class="text-red" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="red--text text--darken-2" /></template>',
      output: '<template><div class="text-red-darken-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="darken-2" /></template>',
      output: '<template><div class="darken-2" /></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><div class="text--darken-2" /></template>',
      output: '<template><div class="text--darken-2" /></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><div class="asdfg" /></template>',
      output: '<template><div class="bg-asdfg" /></template>',
      errors: [{ messageId: 'replacedWith' }],
      options: [{ themeColors: ['asdfg'] }],
    },
    {
      code: '<template><div class="asdfg--text" /></template>',
      output: '<template><div class="text-asdfg" /></template>',
      errors: [{ messageId: 'replacedWith' }],
      options: [{ themeColors: ['asdfg'] }],
    },
  ],
})
