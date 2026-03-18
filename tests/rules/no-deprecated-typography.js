const { tester } = require('../setup')
const rule = require('../../src/rules/no-deprecated-typography')

tester.run('no-deprecated-typography', rule, {
  valid: [
    // MD3 classes are fine
    '<template><div class="text-display-large" /></template>',
    '<template><div class="text-headline-small" /></template>',
    '<template><div class="text-body-large" /></template>',
    // Legacy classes not flagged by default (need v3preset)
    '<template><div class="display-4" /></template>',
    '<template><div class="headline" /></template>',
    '<template><div class="caption" /></template>',
    // Breakpoint-prefixed MD3 classes are fine
    '<template><div class="text-md-headline-small" /></template>',
    '<template><div class="text-sm-display-large" /></template>',
    // Unrelated classes
    '<template><div class="pa-2 ma-1" /></template>',
    // Empty
    '<template><div class="" /></template>',
    '<template><div class /></template>',
    // Disabled via config
    {
      code: '<template><div class="text-h1" /></template>',
      options: [{ 'text-h1': false }],
    },
    // Disabling base class also suppresses its responsive variants
    {
      code: '<template><div class="text-md-h6" /></template>',
      options: [{ 'text-h6': false }],
    },
  ],
  invalid: [
    // MD2 → MD3 (defaults)
    {
      code: '<template><div class="text-h1" /></template>',
      output: '<template><div class="text-display-large" /></template>',
      errors: [{ messageId: 'replacedWith', data: { a: 'text-h1', b: 'text-display-large' } }],
    },
    {
      code: '<template><div class="text-h2" /></template>',
      output: '<template><div class="text-display-medium" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-h3" /></template>',
      output: '<template><div class="text-display-small" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-h4" /></template>',
      output: '<template><div class="text-headline-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-h5" /></template>',
      output: '<template><div class="text-headline-medium" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-h6" /></template>',
      output: '<template><div class="text-headline-small" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-subtitle-1" /></template>',
      output: '<template><div class="text-body-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-subtitle-2" /></template>',
      output: '<template><div class="text-label-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-body-1" /></template>',
      output: '<template><div class="text-body-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-body-2" /></template>',
      output: '<template><div class="text-body-medium" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-caption" /></template>',
      output: '<template><div class="text-body-small" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-button" /></template>',
      output: '<template><div class="text-label-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-overline" /></template>',
      output: '<template><div class="text-label-small" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Mixed with other classes
    {
      code: '<template><div class="pa-2 text-h1 ma-1" /></template>',
      output: '<template><div class="pa-2 text-display-large ma-1" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Custom mapping override
    {
      code: '<template><div class="text-h1" /></template>',
      output: '<template><div class="my-heading-xl" /></template>',
      options: [{ 'text-h1': 'my-heading-xl' }],
      errors: [{ messageId: 'replacedWith', data: { a: 'text-h1', b: 'my-heading-xl' } }],
    },
    // Custom mapping additions
    {
      code: '<template><div class="legacy-title" /></template>',
      output: '<template><div class="text-headline-large" /></template>',
      options: [{ 'legacy-title': 'text-headline-large' }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // md2: MD1 → MD2 legacy classes
    {
      code: '<template><div class="display-4" /></template>',
      output: '<template><div class="text-h1" /></template>',
      options: [rule.md2],
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="headline" /></template>',
      output: '<template><div class="text-h5" /></template>',
      options: [rule.md2],
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="caption" /></template>',
      output: '<template><div class="text-caption" /></template>',
      options: [rule.md2],
      errors: [{ messageId: 'replacedWith' }],
    },
    // md2 + md3 combined: both mappings active
    {
      code: '<template><div class="display-4 text-h5" /></template>',
      output: '<template><div class="text-h1 text-headline-medium" /></template>',
      options: [{ ...rule.md2, ...rule.md3 }],
      errors: [{ messageId: 'replacedWith' }, { messageId: 'replacedWith' }],
    },
    // Breakpoint-prefixed typography classes
    {
      code: '<template><div class="text-md-h6" /></template>',
      output: '<template><div class="text-md-headline-small" /></template>',
      errors: [{ messageId: 'replacedWith', data: { a: 'text-md-h6', b: 'text-md-headline-small' } }],
    },
    {
      code: '<template><div class="text-sm-h1" /></template>',
      output: '<template><div class="text-sm-display-large" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-lg-body-2" /></template>',
      output: '<template><div class="text-lg-body-medium" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-xl-caption" /></template>',
      output: '<template><div class="text-xl-body-small" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Mixed breakpoint and non-breakpoint
    {
      code: '<template><div class="text-h1 text-md-h6" /></template>',
      output: '<template><div class="text-display-large text-md-headline-small" /></template>',
      errors: [{ messageId: 'replacedWith' }, { messageId: 'replacedWith' }],
    },
  ],
})
