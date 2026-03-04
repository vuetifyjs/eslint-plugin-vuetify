const { tester } = require('../setup')
const rule = require('../../src/rules/no-elevation-prop')

tester.run('no-elevation-prop', rule, {
  valid: [
    '<template><v-card class="elevation-2" /></template>',
    '<template><v-card /></template>',
    '<template><div class="elevation-4" /></template>',
  ],
  invalid: [
    // Static elevation values 0-5
    {
      code: '<template><v-card elevation="0" /></template>',
      output: '<template><v-card class="elevation-0" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-card elevation="1" /></template>',
      output: '<template><v-card class="elevation-1" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-card elevation="2" /></template>',
      output: '<template><v-card class="elevation-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-card elevation="3" /></template>',
      output: '<template><v-card class="elevation-3" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-card elevation="4" /></template>',
      output: '<template><v-card class="elevation-4" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-card elevation="5" /></template>',
      output: '<template><v-card class="elevation-5" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Append to existing class
    {
      code: '<template><v-card elevation="2" class="my-card" /></template>',
      output: '<template><v-card class="my-card elevation-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Bound static value
    {
      code: '<template><v-card :elevation="3" /></template>',
      output: '<template><v-card class="elevation-3" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Out of range — no fix
    {
      code: '<template><v-card elevation="10" /></template>',
      output: null,
      errors: [{ messageId: 'noFix' }],
    },
    // Dynamic value — no fix
    {
      code: '<template><v-card :elevation="level" /></template>',
      output: null,
      errors: [{ messageId: 'noFix' }],
    },
  ],
})
