const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-classes')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-classes', rule, {
  valid: [
    '<template><div class="" /></template>',
    '<template><div class="custom-class" /></template>',
    '<template><div class="multiple classes" /></template>',
    '<template><div class="justify-center" /></template>',
    '<template><div class="text-h1" /></template>',
    // https://github.com/vuetifyjs/eslint-plugin-vuetify/issues/2
    '<template><div class /></template>',
  ],
  invalid: [
    {
      code: '<template><div class="scroll-y" /></template>',
      output: '<template><div class="overflow-y-auto" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-xs-center" /></template>',
      output: '<template><div class="text-center" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="display-4" /></template>',
      output: '<template><div class="text-h1" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})