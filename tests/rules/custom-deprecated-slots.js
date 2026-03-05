const { tester } = require('../setup')
const rule = require('../../src/rules/custom-deprecated-slots')

tester.run('custom-deprecated-slots', rule, {
  valid: [
    // No options — rule is a no-op
    '<template><v-menu><template #activator></template></v-menu></template>',
    // Component not in config
    {
      code: '<template><v-menu><template #activator></template></v-menu></template>',
      options: [{ VSnackbar: { action: 'actions' } }],
    },
    // Slot not in config
    {
      code: '<template><v-snackbar><template #default></template></v-snackbar></template>',
      options: [{ VSnackbar: { action: 'actions' } }],
    },
  ],
  invalid: [
    // String replacement
    {
      code: '<template><v-snackbar><template #action></template></v-snackbar></template>',
      output: '<template><v-snackbar><template #actions></template></v-snackbar></template>',
      options: [{ VSnackbar: { action: 'actions' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Removed slot (false)
    {
      code: '<template><v-dialog><template #activator></template></v-dialog></template>',
      options: [{ VDialog: { activator: false } }],
      errors: [{ messageId: 'removed' }],
    },
    // Custom message
    {
      code: '<template><v-dialog><template #activator></template></v-dialog></template>',
      options: [{ VDialog: { activator: { message: 'Use v-model instead' } } }],
      errors: [{ messageId: 'removedWithMessage' }],
    },
    // Kebab-case component key
    {
      code: '<template><v-snackbar><template #action></template></v-snackbar></template>',
      output: '<template><v-snackbar><template #actions></template></v-snackbar></template>',
      options: [{ 'v-snackbar': { action: 'actions' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
