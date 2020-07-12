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
    '<template><v-layout text-center /></template>',
    '<template><div class="text-h1" /></template>',
    '<template><div class="text-h2" /></template>',
    '<template><div class="text-h3" /></template>',
    '<template><div class="text-h4" /></template>',
    '<template><div class="text-h5" /></template>',
    '<template><div class="text-h6" /></template>',
    '<template><div class="text-subtitle-1" /></template>',
    '<template><div class="text-subtitle-2" /></template>',
    '<template><div class="text-body-1" /></template>',
    '<template><div class="text-body-2" /></template>',
    '<template><div class="text-caption" /></template>',
    '<template><div class="text-text-overline" /></template>',
    // https://github.com/vuetifyjs/eslint-plugin-vuetify/issues/2
    '<template><div class /></template>'
  ],
  invalid: [
    {
      code: '<template><div class="scroll-y" /></template>',
      output: '<template><div class="overflow-y-auto" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><v-layout scroll-y /></template>',
      output: '<template><v-layout overflow-y-auto /></template>',
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
      code: `<template><v-layout\n  wrap\n  row\n/></template>`,
      output: '<template><v-layout\n  wrap\n/></template>',
      errors: [`Don't use "row" on <v-layout>, see https://github.com/vuetifyjs/vuetify/commit/3f435b5a`]
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
    },
    {
      code: '<template><div class="display-4" /></template>',
      output: '<template><div class="text-h1" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="display-3" /></template>',
      output: '<template><div class="text-h2" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="display-2" /></template>',
      output: '<template><div class="text-h3" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="display-1" /></template>',
      output: '<template><div class="text-h4" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="headline" /></template>',
      output: '<template><div class="text-h5" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="title" /></template>',
      output: '<template><div class="text-h6" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="subtitle-1" /></template>',
      output: '<template><div class="text-subtitle-1" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="subtitle-2" /></template>',
      output: '<template><div class="text-subtitle-2" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="body-1" /></template>',
      output: '<template><div class="text-body-1" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="body-2" /></template>',
      output: '<template><div class="text-body-2" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="caption" /></template>',
      output: '<template><div class="text-caption" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    },
    {
      code: '<template><div class="overline" /></template>',
      output: '<template><div class="text-overline" /></template>',
      errors: [{ messageId: 'replacedWith' }]
    }
  ]
})
