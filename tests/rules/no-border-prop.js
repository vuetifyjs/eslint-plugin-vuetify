const { tester } = require('../setup')
const rule = require('../../src/rules/no-border-prop')

tester.run('no-border-prop', rule, {
  valid: [
    '<template><v-card class="border-t" /></template>',
    '<template><v-card /></template>',
    '<template><div class="border" /></template>',
  ],
  invalid: [
    // Boolean (no value) — border as prop
    {
      code: '<template><v-card border /></template>',
      output: '<template><v-card class="border" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Single value
    {
      code: '<template><v-card border="t" /></template>',
      output: '<template><v-card class="border-t" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Multiple values
    {
      code: '<template><v-card border="t sm" /></template>',
      output: '<template><v-card class="border-t border-sm" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Append to existing class
    {
      code: '<template><v-card border="t" class="my-card" /></template>',
      output: '<template><v-card class="my-card border-t" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Bound static value
    {
      code: '<template><v-card :border="\'b\'" /></template>',
      output: '<template><v-card class="border-b" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Complex value
    {
      code: '<template><v-card border="t b opacity-50" /></template>',
      output: '<template><v-card class="border-t border-b border-opacity-50" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Dynamic value — no fix
    {
      code: '<template><v-card :border="borderValue" /></template>',
      output: null,
      errors: [{ messageId: 'noFix' }],
    },
  ],
})
