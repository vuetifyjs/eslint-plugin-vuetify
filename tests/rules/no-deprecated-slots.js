const RuleTester = require('eslint').RuleTester
const rule = require('../../src/rules/no-deprecated-slots')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 },
})

tester.run('no-deprecated-slots', rule, {
  valid: [
`<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn v-bind="props" />
    </template>
  </v-dialog>
</template>`,
`<template>
  <v-dialog>
    <template #activator="data">
      <v-btn v-bind="data.props" />
    </template>
  </v-dialog>
</template>`,
  ],

  invalid: [
    {
      code:
`<template>
  <v-dialog>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" />
    </template>
  </v-dialog>
</template>`,
      output:
`<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn v-bind="props" />
    </template>
  </v-dialog>
</template>`,
      errors: [{ messageId: 'changedProps' }],
    },
    {
      code:
`<template>
  <v-dialog>
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" v-on="on" />
    </template>
  </v-dialog>
</template>`,
      output:
`<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn v-bind="props" />
    </template>
  </v-dialog>
</template>`,
      errors: [{ messageId: 'changedProps' }],
    },
    {
      code:
`<template>
  <v-dialog>
    <template #activator="{ on }">
      <v-btn v-on="on" />
    </template>
  </v-dialog>
</template>`,
      output:
`<template>
  <v-dialog>
    <template #activator="{ props }">
      <v-btn v-bind="props" />
    </template>
  </v-dialog>
</template>`,
      errors: [{ messageId: 'changedProps' }],
    },
    {
      code:
`<template>
  <v-dialog>
    <template #activator="{ attrs }">
      <v-btn v-bind="attrs" />
    </template>
  </v-dialog>
</template>`,
      output:
`<template>
  <v-dialog>
    <template #activator="{ attrs }">
      <v-btn v-bind="attrs" />
    </template>
  </v-dialog>
</template>`,
      errors: [{ messageId: 'invalidProps' }],
    },
    {
      code:
`<template>
  <v-dialog>
    <template #activator="data">
      <v-btn v-bind="data.attrs" v-on="data.on" />
    </template>
  </v-dialog>
</template>`,
      output:
`<template>
  <v-dialog>
    <template #activator="data">
      <v-btn v-bind="data.props" />
    </template>
  </v-dialog>
</template>`,
      errors: [{ messageId: 'changedProps' }, { messageId: 'changedProps' }],
    },
    {
      code:
`<template>
  <something-else v-slot="props">
    <v-dialog>
      <template #activator="{ on }">
        <v-btn v-on="on" />
      </template>
    </v-dialog>
  </something-else>
</template>`,
      output:
`<template>
  <something-else v-slot="props">
    <v-dialog>
      <template #activator="{ props }">
        <v-btn v-bind="props" />
      </template>
    </v-dialog>
  </something-else>
</template>`,
      errors: [{ messageId: 'changedProps' }],
    },
    // TODO: handle variable shadowing
    //     {
    //       code:
    // `<template>
    //   <something-else v-slot="props">
    //     <v-dialog>
    //       <template #activator="{ on }">
    //         <v-btn v-on="on" :foo="props.foo" />
    //       </template>
    //     </v-dialog>
    //   </something-else>
    // </template>`,
    //       output:
    // `<template>
    //   <something-else v-slot="props">
    //     <v-dialog>
    //       <template #activator="{ props: dialogProps }">
    //         <v-btn v-bind="dialogProps" :foo="props.foo" />
    //       </template>
    //     </v-dialog>
    //   </something-else>
    // </template>`,
    //       errors: [{ messageId: 'changedProps' }],
    //     },
    //     {
    //       output:
    // `<template>
    //   <v-menu>
    //     <template #activator="{ on: menuOn }">
    //       <v-tooltip>
    //         <template #activator="{ on: tooltipOn }">
    //           <v-btn v-on="{ ...tooltipOn, ...menuOn }" />
    //         </template>
    //       </v-tooltip>
    //     </template>
    //   </v-menu>
    // </template>`,
    //       code:
    // `<template>
    //   <v-menu>
    //     <template #activator="{ on: menuOn }">
    //       <v-tooltip>
    //         <template #activator="{ on: tooltipOn }">
    //           <v-btn v-on="{ ...tooltipOn, ...menuOn }" />
    //         </template>
    //       </v-tooltip>
    //     </template>
    //   </v-menu>
    // </template>`,
    //       errors: [{ messageId: 'changedProps' }],
    //     },
  ],
})
