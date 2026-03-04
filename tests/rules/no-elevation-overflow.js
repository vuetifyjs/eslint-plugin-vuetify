const { tester } = require('../setup')
const rule = require('../../src/rules/no-elevation-overflow')

tester.run('no-elevation-overflow', rule, {
  valid: [
    '<template><div class="elevation-0" /></template>',
    '<template><div class="elevation-3" /></template>',
    '<template><div class="elevation-5" /></template>',
    '<template><div class="elevation-5 pa-2" /></template>',
    '<template><v-card elevation="4" /></template>',
    '<template><v-card :elevation="3" /></template>',
    // Dynamic values we can't check
    '<template><v-card :elevation="level" /></template>',
    // Not elevation
    '<template><div class="text-elevation" /></template>',
  ],
  invalid: [
    // Static class
    {
      code: '<template><div class="elevation-6" /></template>',
      errors: [{ messageId: 'overflow', data: { level: '6', max: '5' } }],
    },
    {
      code: '<template><div class="elevation-24" /></template>',
      errors: [{ messageId: 'overflow', data: { level: '24', max: '5' } }],
    },
    // Mixed classes
    {
      code: '<template><div class="pa-2 elevation-10 ma-1" /></template>',
      errors: [{ messageId: 'overflow', data: { level: '10', max: '5' } }],
    },
    // Bound class with string literal
    {
      code: `<template><div :class="'elevation-8'" /></template>`,
      errors: [{ messageId: 'overflow', data: { level: '8', max: '5' } }],
    },
    // elevation prop (static)
    {
      code: '<template><v-card elevation="12" /></template>',
      errors: [{ messageId: 'overflow', data: { level: '12', max: '5' } }],
    },
    // elevation prop (bound literal)
    {
      code: '<template><v-card :elevation="20" /></template>',
      errors: [{ messageId: 'overflow', data: { level: '20', max: '5' } }],
    },
  ],
})
