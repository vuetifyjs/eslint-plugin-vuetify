const { tester } = require('../setup')
const rule = require('../../src/rules/custom-deprecated-events')

tester.run('custom-deprecated-events', rule, {
  valid: [
    // No options — rule is a no-op
    '<template><v-btn @click="handler" /></template>',
    // Component not in config
    {
      code: '<template><v-card @click="handler" /></template>',
      options: [{ VBtn: { change: 'update:modelValue' } }],
    },
    // Event not in config
    {
      code: '<template><v-btn @click="handler" /></template>',
      options: [{ VBtn: { change: 'update:modelValue' } }],
    },
  ],
  invalid: [
    // String replacement
    {
      code: '<template><v-btn @change="handler" /></template>',
      output: '<template><v-btn @update:model-value="handler" /></template>',
      options: [{ VBtn: { change: 'update:modelValue' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Removed event (false)
    {
      code: '<template><v-tabs @next="handler" /></template>',
      options: [{ VTabs: { next: false } }],
      errors: [{ messageId: 'removed' }],
    },
    // Custom message
    {
      code: '<template><v-tabs @next="handler" /></template>',
      options: [{ VTabs: { next: { message: 'Use v-model instead' } } }],
      errors: [{ messageId: 'removedWithMessage' }],
    },
    // Kebab-case component key
    {
      code: '<template><v-btn @change="handler" /></template>',
      output: '<template><v-btn @update:model-value="handler" /></template>',
      options: [{ 'v-btn': { change: 'update:modelValue' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
    // Colon-separated event name (update:modelValue -> click)
    {
      code: '<template><v-radio @update:model-value="handler" /></template>',
      output: '<template><v-radio @click="handler" /></template>',
      options: [{ VRadio: { 'update:modelValue': 'click' } }],
      errors: [{ messageId: 'replacedWith' }],
    },
  ],
})
