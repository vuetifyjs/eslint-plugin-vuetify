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
    '<template><div class="justify-center" /></template>'
  ],
  invalid: [
    // {
    //   code: '<template><div class="justify-center" /></template>',
    //   output: '<template><div class="justify-content-center" /></template>',
    //   errors: ['justify-center has been removed']
    // }
  ]
})
