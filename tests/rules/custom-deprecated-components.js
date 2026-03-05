const { tester } = require('../setup')
const rule = require('../../src/rules/custom-deprecated-components')

tester.run('custom-deprecated-components', rule, {
  valid: [
    // No options — rule is a no-op
    '<template><v-row /></template>',
    // Component not in list
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
      errors: [{ messageId: 'deprecatedWithReplacement' }],
    },
    // Multiple classes from dot notation
    {
      code: '<template><v-col /></template>',
      output: '<template><div class="pa-3 col-span-4" /></template>',
      options: [{ VCol: 'div.pa-3.col-span-4' }],
      errors: [{ messageId: 'deprecatedWithReplacement' }],
    },
    // Replacement merges with existing class
    {
      code: '<template><v-row class="mb-4"></v-row></template>',
      output: '<template><div class="mb-4 grid grid-cols-12"></div></template>',
      options: [{ VRow: 'div.grid.grid-cols-12' }],
      errors: [{ messageId: 'deprecatedWithReplacement' }],
    },
    // Simple tag replacement (no classes)
    {
      code: '<template><v-row /></template>',
      output: '<template><custom-row /></template>',
      options: [{ VRow: 'custom-row' }],
      errors: [{ messageId: 'deprecatedWithReplacement' }],
    },
    // Deprecated with no replacement (false)
    {
      code: '<template><v-snackbar /></template>',
      options: [{ VSnackbar: false }],
      errors: [{ messageId: 'deprecated' }],
    },
    // Deprecated with custom message
    {
      code: '<template><v-snackbar /></template>',
      options: [{ VSnackbar: { message: 'Use <AppSnackbar> from @/components instead' } }],
      errors: [{ messageId: 'deprecatedWithMessage' }],
    },
    // Kebab-case component usage
    {
      code: '<template><v-snackbar /></template>',
      options: [{ 'v-snackbar': false }],
      errors: [{ messageId: 'deprecated' }],
    },
  ],
})
