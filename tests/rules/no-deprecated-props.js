const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-props')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-props', rule, {
  valid: [
    // https://github.com/vuetifyjs/eslint-plugin-vuetify/issues/35
    '<template><v-btn v-bind="" /></template>',
  ],

  invalid: [
    {
      code: '<template><v-btn outline /></template>',
      output: '<template><v-btn variant="outlined" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-btn :outline="false" /></template>',
      output: `<template><v-btn :variant="false && 'outlined'" /></template>`,
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-btn v-bind:outline="false" /></template>',
      output: `<template><v-btn v-bind:variant="false && 'outlined'" /></template>`,
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-alert border="left" /></template>',
      output: '<template><v-alert border="start" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
