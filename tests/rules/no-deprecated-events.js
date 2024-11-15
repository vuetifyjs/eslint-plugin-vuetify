const tester = require('../setup').tester
const rule = require('../../src/rules/no-deprecated-events')

tester.run('no-deprecated-events', rule, {
  valid: [
    '<template><v-btn v-on="" /></template>',
    '<template><v-btn v-on:[arg]="" /></template>',
    '<template><v-btn v-on:click="" /></template>',
    '<template><v-btn @click="" /></template>',
    '<template><v-btn v-on:click="onClick" /></template>',
    '<template><v-btn @click="onClick" /></template>',
  ],

  invalid: [
    {
      code: '<template><v-combobox @change="" /></template>',
      errors: [{ messageId: 'removed' }],
    },
    {
      code: '<template><v-combobox @update:searchInput="" /></template>',
      output: '<template><v-combobox @update:search="" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-combobox @update:search-input="" /></template>',
      output: '<template><v-combobox @update:search="" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
    {
      code: '<template><v-combobox @input="" /></template>',
      output: '<template><v-combobox @update:model-value="" /></template>',
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
