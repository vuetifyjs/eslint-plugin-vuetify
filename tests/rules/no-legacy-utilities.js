const { tester } = require('../setup')
const rule = require('../../src/rules/no-legacy-utilities')

tester.run('no-legacy-utilities', rule, {
  valid: [
    // Tailwind classes are fine
    '<template><div class="flex" /></template>',
    '<template><div class="hidden" /></template>',
    '<template><div class="items-center" /></template>',
    // Unrelated classes
    '<template><div class="my-custom-class" /></template>',
    // Empty
    '<template><div class="" /></template>',
    '<template><div class /></template>',
    // Disabled via config
    {
      code: '<template><div class="d-flex" /></template>',
      options: [{ 'd-flex': false }],
    },
  ],
  invalid: [
    // Display utilities
    {
      code: '<template><div class="d-flex" /></template>',
      output: '<template><div class="flex" /></template>',
      errors: [{ messageId: 'replacedWith', data: { a: 'd-flex', b: 'flex' } }],
    },
    {
      code: '<template><div class="d-none" /></template>',
      output: '<template><div class="hidden" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="d-block" /></template>',
      output: '<template><div class="block" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="d-inline-flex" /></template>',
      output: '<template><div class="inline-flex" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Alignment
    {
      code: '<template><div class="align-center" /></template>',
      output: '<template><div class="items-center" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="align-start" /></template>',
      output: '<template><div class="items-start" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Justify
    {
      code: '<template><div class="justify-space-between" /></template>',
      output: '<template><div class="justify-between" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="justify-space-around" /></template>',
      output: '<template><div class="justify-around" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Flex utilities
    {
      code: '<template><div class="flex-grow-1" /></template>',
      output: '<template><div class="grow" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="flex-shrink-0" /></template>',
      output: '<template><div class="shrink-0" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="flex-column" /></template>',
      output: '<template><div class="flex-col" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Font weight
    {
      code: '<template><div class="font-weight-bold" /></template>',
      output: '<template><div class="font-bold" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="font-weight-regular" /></template>',
      output: '<template><div class="font-normal" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Text utilities
    {
      code: '<template><div class="text-truncate" /></template>',
      output: '<template><div class="truncate" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="text-no-wrap" /></template>',
      output: '<template><div class="whitespace-nowrap" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Size utilities
    {
      code: '<template><div class="fill-height" /></template>',
      output: '<template><div class="h-full" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="w-100" /></template>',
      output: '<template><div class="w-full" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Spacing utilities
    {
      code: '<template><div class="ma-2" /></template>',
      output: '<template><div class="m-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="pa-4" /></template>',
      output: '<template><div class="p-4" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><div class="ma-auto" /></template>',
      output: '<template><div class="m-auto" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Negative margins
    {
      code: '<template><div class="ma-n2" /></template>',
      output: '<template><div class="-m-2" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    // Mixed with other classes
    {
      code: '<template><div class="pa-2 d-flex align-center" /></template>',
      output: '<template><div class="p-2 flex items-center" /></template>',
      errors: [
        { messageId: 'replacedWith' },
        { messageId: 'replacedWith' },
        { messageId: 'replacedWith' },
      ],
    },
    // Custom mapping override
    {
      code: '<template><div class="d-flex" /></template>',
      output: '<template><div class="my-flex" /></template>',
      options: [{ 'd-flex': 'my-flex' }],
      errors: [{ messageId: 'replacedWith', data: { a: 'd-flex', b: 'my-flex' } }],
    },
  ],
})
