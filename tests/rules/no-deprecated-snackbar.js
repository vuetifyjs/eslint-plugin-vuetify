const { tester } = require('../setup')
const rule = require('../../src/rules/no-deprecated-snackbar')

tester.run('no-deprecated-snackbar', rule, {
  valid: [
    // Already using the correct slot name
    `<template>
  <v-snackbar-queue>
    <template #item="{ item }">
      <v-snackbar v-bind="item" />
    </template>
  </v-snackbar-queue>
</template>`,
    // Unrelated components
    `<template>
  <v-snackbar>
    <template #default>Hello</template>
  </v-snackbar>
</template>`,
    // Correct prop usage
    '<template><v-snackbar min-height="68" /></template>',
  ],
  invalid: [
    // VSnackbar: multi-line -> min-height="68"
    {
      code: '<template><v-snackbar multi-line /></template>',
      output: '<template><v-snackbar min-height="68" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // VSnackbarQueue: #default -> #item
    {
      code:
`<template>
  <v-snackbar-queue>
    <template #default="{ item }">
      <v-snackbar v-bind="item" />
    </template>
  </v-snackbar-queue>
</template>`,
      output:
`<template>
  <v-snackbar-queue>
    <template #item="{ item }">
      <v-snackbar v-bind="item" />
    </template>
  </v-snackbar-queue>
</template>`,
      errors: [{ messageId: 'renamed' }],
    },
  ],
})
