const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-imports')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
})

tester.run('no-deprecated-imports', rule, {
  valid: [
    'import colors from "vuetify/util/colors"',
    `import colors from 'vuetify/util/colors'`,
  ],
  invalid: [
    {
      code: `import colors from 'vuetify/lib/util/colors'`,
      output: `import colors from 'vuetify/util/colors'`,
      errors: [{ message: 'Import from "vuetify/lib/util/colors" is deprecated. Use "vuetify/util/colors" instead.' }],
    },
    {
      code: `import colors from "vuetify/lib/util/colors"`,
      output: `import colors from "vuetify/util/colors"`,
      errors: [{ message: 'Import from "vuetify/lib/util/colors" is deprecated. Use "vuetify/util/colors" instead.' }],
    },
  ],
})
