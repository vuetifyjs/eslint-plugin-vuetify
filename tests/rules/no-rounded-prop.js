const { tester } = require('../setup')
const rule = require('../../src/rules/no-rounded-prop')

tester.run('no-rounded-prop', rule, {
  valid: [
    '<template><v-card class="rounded-lg" /></template>',
    '<template><v-card /></template>',
    '<template><div class="rounded-full" /></template>',
  ],
  invalid: [
    // Boolean (no value)
    {
      code: '<template><v-card rounded /></template>',
      output: '<template><v-card class="rounded" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="0"
    {
      code: '<template><v-card rounded="0" /></template>',
      output: '<template><v-card class="rounded-none" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="sm"
    {
      code: '<template><v-card rounded="sm" /></template>',
      output: '<template><v-card class="rounded-sm" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="lg"
    {
      code: '<template><v-card rounded="lg" /></template>',
      output: '<template><v-card class="rounded-lg" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="xl"
    {
      code: '<template><v-card rounded="xl" /></template>',
      output: '<template><v-card class="rounded-xl" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="circle"
    {
      code: '<template><v-card rounded="circle" /></template>',
      output: '<template><v-card class="rounded-full" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="pill"
    {
      code: '<template><v-card rounded="pill" /></template>',
      output: '<template><v-card class="rounded-full" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // rounded="shaped"
    {
      code: '<template><v-card rounded="shaped" /></template>',
      output: '<template><v-card class="rounded-te-xl rounded-bs-xl" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Append to existing class
    {
      code: '<template><v-card rounded="lg" class="my-card" /></template>',
      output: '<template><v-card class="my-card rounded-lg" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Bound static value
    {
      code: '<template><v-card :rounded="\'circle\'" /></template>',
      output: '<template><v-card class="rounded-full" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Unknown value — no fix
    {
      code: '<template><v-card rounded="xxl" /></template>',
      output: null,
      errors: [{ messageId: 'noFix' }],
    },
    // Dynamic value — no fix
    {
      code: '<template><v-card :rounded="roundedValue" /></template>',
      output: null,
      errors: [{ messageId: 'noFix' }],
    },
  ],
})
