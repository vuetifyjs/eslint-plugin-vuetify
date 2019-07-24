'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-classes')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-deprecated-classes', rule, {
  valid: [
    '<template><div class="" /></template>',
    '<template><div class="custom-class" /></template>',
    '<template><div class="multiple classes" /></template>',
    '<template><div class="justify-center" /></template>',
    '<template><v-layout text-center /></template>'
  ],
  invalid: [
    {
      code: '<template><div class="scroll-y" /></template>',
      output: '<template><div class="overflow-y-auto" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="text-xs-center" /></template>',
      output: '<template><div class="text-center" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><v-layout text-xs-center /></template>',
      output: '<template><v-layout text-center /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><v-layout row wrap /></template>',
      output: '<template><v-layout wrap /></template>',
      errors: [`Don't use "row" on <v-layout>, see https://github.com/vuetifyjs/vuetify/commit/3f435b5a`]
    },
    {
      code: '<template><v-layout :row="foo" wrap /></template>',
      output: '<template><v-layout :row="foo" wrap /></template>',
      errors: [`Don't use "row" on <v-layout>, see https://github.com/vuetifyjs/vuetify/commit/3f435b5a`]
    }
  ]
})
