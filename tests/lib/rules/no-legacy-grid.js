'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-legacy-grid')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-legacy-grid', rule, {
  valid: [
    '<template><v-row /></template>',
    '<template><v-col /></template>'
  ],
  invalid: [
    {
      code: '<template><v-layout /></template>',
      output: '<template><v-row /></template>',
      errors: ['Don\'t use deprecated grid components']
    },
    {
      code: '<template><v-layout></v-layout></template>',
      output: '<template><v-row></v-row></template>',
      errors: ['Don\'t use deprecated grid components']
    },
    {
      code: '<template><v-layout row wrap /></template>',
      output: '<template><v-row /></template>',
      errors: ['Don\'t use deprecated grid components']
    },
    {
      code: '<template><v-flex xs12 sm4 md3 /></template>',
      output: '<template><v-col cols="12" sm="4" md="3" /></template>',
      errors: Array(4).fill('Don\'t use deprecated grid components')
    },
    {
      code: '<template><v-flex xs6 offset-sm1 /></template>',
      output: '<template><v-col cols="6" offset-sm="1" /></template>',
      errors: Array(3).fill('Don\'t use deprecated grid components')
    }
  ]
})
