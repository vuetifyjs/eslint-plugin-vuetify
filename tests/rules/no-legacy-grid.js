const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-legacy-grid')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-legacy-grid', rule, {
  valid: [
    '<template><v-row /></template>',
    '<template><v-col /></template>',
  ],
  invalid: [
    {
      code: '<template><v-layout /></template>',
      output: '<template><v-row /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-layout></v-layout></template>',
      output: '<template><v-row></v-row></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-layout column /></template>',
      output: '<template><v-row column /></template>',
      errors: [{ messageId: 'replacedWith' }, { messageId: 'removed' }],
    },
    {
      code: '<template><v-layout row wrap /></template>',
      output: '<template><v-row   /></template>',
      errors: [{ messageId: 'replacedWith' }, { messageId: 'removed' }, { messageId: 'removed' }],
    },
    {
      code: '<template><v-layout justify-center /></template>',
      output: '<template><v-row justify="center" /></template>',
      errors: [{ messageId: 'replacedWith' }, { messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-layout justify-between /></template>',
      output: '<template><v-row justify="space-between" /></template>',
      errors: [{ messageId: 'replacedWith' }, { messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-flex xs12 sm4 md3 /></template>',
      output: '<template><v-col cols="12" sm="4" md="3" /></template>',
      errors: Array(4).fill({ messageId: 'replacedWith' }),
    },
    {
      code: '<template><v-flex xs6 offset-sm1 /></template>',
      output: '<template><v-col cols="6" offset-sm="1" /></template>',
      errors: Array(3).fill({ messageId: 'replacedWith' }),
    },
    {
      code: `<template>
        <v-layout
          fill-height
          align-center
          align-self-center
          justify-center
          order-xs3
          order-sm1
          offset-xs1
          offset-sm2
          ma-0
        />
      </template>`,
      output: `<template>
        <v-row
          fill-height
          align="center"
          align-self="center"
          justify="center"
          order="3"
          order-sm="1"
          offset="1"
          offset-sm="2"
          ma-0
        />
      </template>`,
      errors: Array(8).fill({ messageId: 'replacedWith' }),
    },
  ],
})
