const { tester } = require('../setup')
const rule = require('../../src/rules/no-banned-components')

tester.run('no-banned-components', rule, {
  valid: [
    // No options — rule is a no-op
    '<template><v-row /></template>',
    // Component not in ban list
    {
      code: '<template><v-container /></template>',
      options: [{ VRow: 'div.grid.grid-cols-12' }],
    },
    // Kebab-case keys work too
    {
      code: '<template><v-container /></template>',
      options: [{ 'v-row': 'div.grid.grid-cols-12' }],
    },
  ],
  invalid: [
    // Replacement with tag + classes
    {
      code: '<template><v-row></v-row></template>',
      output: '<template><div class="grid grid-cols-12"></div></template>',
      options: [{ VRow: 'div.grid.grid-cols-12' }],
      errors: [{ messageId: 'bannedWithReplacement' }],
    },
    // Multiple classes from dot notation
    {
      code: '<template><v-col /></template>',
      output: '<template><div class="pa-3 col-span-4" /></template>',
      options: [{ VCol: 'div.pa-3.col-span-4' }],
      errors: [{ messageId: 'bannedWithReplacement' }],
    },
    // Replacement merges with existing class
    {
      code: '<template><v-row class="mb-4"></v-row></template>',
      output: '<template><div class="mb-4 grid grid-cols-12"></div></template>',
      options: [{ VRow: 'div.grid.grid-cols-12' }],
      errors: [{ messageId: 'bannedWithReplacement' }],
    },
    // Simple tag replacement (no classes)
    {
      code: '<template><v-row /></template>',
      output: '<template><custom-row /></template>',
      options: [{ VRow: 'custom-row' }],
      errors: [{ messageId: 'bannedWithReplacement' }],
    },
    // Banned with no replacement (false)
    {
      code: '<template><v-snackbar /></template>',
      options: [{ VSnackbar: false }],
      errors: [{ messageId: 'banned' }],
    },
    // Kebab-case component usage
    {
      code: '<template><v-snackbar /></template>',
      options: [{ 'v-snackbar': false }],
      errors: [{ messageId: 'banned' }],
    },
  ],
})
