const { tester } = require('../setup')
const rule = require('../../src/rules/custom-deprecated-props')

tester.run('custom-deprecated-props', rule, {
  valid: [
    // No options — rule is a no-op
    '<template><v-btn color="primary" /></template>',
    // Component not in config
    {
      code: '<template><v-card flat /></template>',
      options: [{ VBtn: { outline: 'outlined' } }],
    },
    // Prop not in config
    {
      code: '<template><v-btn color="primary" /></template>',
      options: [{ VBtn: { outline: 'outlined' } }],
    },
    // Kebab-case component key
    {
      code: '<template><v-card flat /></template>',
      options: [{ 'v-btn': { outline: 'outlined' } }],
    },
  ],
  invalid: [
    // String replacement
    {
      code: '<template><v-btn outline /></template>',
      output: '<template><v-btn outlined /></template>',
      options: [{ VBtn: { outline: 'outlined' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Removed prop (false)
    {
      code: '<template><v-btn shaped /></template>',
      options: [{ VBtn: { shaped: false } }],
      errors: [{ messageId: 'removed' }],
    },
    // Custom message
    {
      code: '<template><v-btn shaped /></template>',
      options: [{ VBtn: { shaped: { message: 'Use rounded instead' } } }],
      errors: [{ messageId: 'removedWithMessage' }],
    },
    // Kebab-case component key
    {
      code: '<template><v-btn outline /></template>',
      output: '<template><v-btn outlined /></template>',
      options: [{ 'v-btn': { outline: 'outlined' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Bound prop (v-bind:)
    {
      code: '<template><v-btn :outline="true" /></template>',
      output: '<template><v-btn :outlined="true" /></template>',
      options: [{ VBtn: { outline: 'outlined' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Kebab-case prop key in config
    {
      code: '<template><v-text-field append-outer-icon="mdi-eye" /></template>',
      output: '<template><v-text-field append-icon="mdi-eye" /></template>',
      options: [{ VTextField: { 'append-outer-icon': 'append-icon' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
