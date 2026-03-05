const { tester } = require('../setup')
const rule = require('../../src/rules/no-legacy-grid-props')

tester.run('no-legacy-grid-props', rule, {
  valid: [
    // VRow with utility classes is fine
    '<template><v-row class="align-center justify-space-between" /></template>',
    // VRow with non-deprecated props
    '<template><v-row no-gutters /></template>',
    // VCol with non-deprecated props
    '<template><v-col cols="6" sm="4" /></template>',
    // VCol with non-existing prop (user error, we don't intervene)
    '<template><v-col align="center" /></template>',
    // VRow with new density prop
    '<template><v-row density="compact" /></template>',
    // Non-grid components are ignored
    '<template><v-btn align="center" /></template>',
    // VCol with offset prop (still valid)
    '<template><v-col offset="3" /></template>',
  ],
  invalid: [
    // VRow: align prop -> class
    {
      code: '<template><v-row align="center" /></template>',
      output: '<template><v-row class="align-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: justify prop -> class
    {
      code: '<template><v-row justify="space-between" /></template>',
      output: '<template><v-row class="justify-space-between" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: align-content prop -> class
    {
      code: '<template><v-row align-content="center" /></template>',
      output: '<template><v-row class="align-content-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: responsive align-sm -> class
    {
      code: '<template><v-row align-sm="start" /></template>',
      output: '<template><v-row class="align-sm-start" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: responsive justify-md -> class
    {
      code: '<template><v-row justify-md="center" /></template>',
      output: '<template><v-row class="justify-md-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: dense -> density="compact"
    {
      code: '<template><v-row dense /></template>',
      output: '<template><v-row density="compact" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // VCol: order prop -> class
    {
      code: '<template><v-col order="2" /></template>',
      output: '<template><v-col class="order-2" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VCol: responsive order-md -> class
    {
      code: '<template><v-col order-md="1" /></template>',
      output: '<template><v-col class="order-md-1" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VCol: align-self -> class
    {
      code: '<template><v-col align-self="center" /></template>',
      output: '<template><v-col class="align-self-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: bound prop with static value
    {
      code: '<template><v-row :align="\'center\'" /></template>',
      output: '<template><v-row class="align-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
    // VRow: bound prop with dynamic value (no fix)
    {
      code: '<template><v-row :align="alignment" /></template>',
      output: null,
      errors: [{ messageId: 'movedToClass' }],
    },
    // Multiple deprecated props on same element (each fix is applied separately)
    {
      code: '<template><v-row align="center" justify="end" /></template>',
      output: '<template><v-row class="align-center" justify="end" /></template>',
      errors: [{ messageId: 'movedToClass' }, { messageId: 'movedToClass' }],
    },
    // Append to existing class attribute
    {
      code: '<template><v-row align="center" class="my-row" /></template>',
      output: '<template><v-row class="my-row align-center" /></template>',
      errors: [{ messageId: 'movedToClass' }],
    },
  ],
})
