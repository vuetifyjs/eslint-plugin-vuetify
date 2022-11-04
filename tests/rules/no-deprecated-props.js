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
    '<template><v-switch value="foo" /></template>',
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
    {
      code: '<template><v-input error-count="2" /></template>',
      output: '<template><v-input max-errors="2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-toolbar src="http://url" /></template>',
      output: '<template><v-toolbar image="http://url" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-menu close-on-click /></template>',
      output: '<template><v-menu :persistent="false" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-menu :close-on-click="false" /></template>',
      output: '<template><v-menu persistent /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-menu :close-on-click="condition" /></template>',
      output: '<template><v-menu :persistent="!(condition)" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-tabs background-color="blue" /></template>',
      output: '<template><v-tabs bg-color="blue" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-dialog hide-overlay /></template>',
      output: '<template><v-dialog :scrim="false" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-window :vertical="condition" /></template>',
      output: `<template><v-window :direction="condition && 'vertical'" /></template>`,
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
