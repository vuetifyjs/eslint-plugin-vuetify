const { tester } = require('../setup')
const rule = require('../../src/rules/no-deprecated-select-item-slot')

tester.run('no-deprecated-select-item-slot', rule, {
  valid: [
    // Using internalItem correctly
`<template>
  <v-select>
    <template #item="{ internalItem, props }">
      <v-list-item v-bind="props" :title="internalItem.title" />
    </template>
  </v-select>
</template>`,
    // Accessing item as raw data (new v4 behavior)
`<template>
  <v-select>
    <template #item="{ item, props }">
      <v-list-item v-bind="props" :title="item.name" />
    </template>
  </v-select>
</template>`,
    // No item destructured
`<template>
  <v-select>
    <template #item="{ props }">
      <v-list-item v-bind="props" />
    </template>
  </v-select>
</template>`,
    // Non-select component
`<template>
  <v-list>
    <template #item="{ item }">
      <v-list-item :title="item.title" />
    </template>
  </v-list>
</template>`,
    // No slot params
    '<template><v-select><template #item>content</template></v-select></template>',
  ],
  invalid: [
    // item.title → internalItem.title
    {
      code:
`<template>
  <v-select>
    <template #item="{ item, props }">
      <v-list-item v-bind="props" :title="item.title" />
    </template>
  </v-select>
</template>`,
      errors: [{ messageId: 'internalAccess', data: { name: 'item', prop: 'title' } }],
    },
    // item.value
    {
      code:
`<template>
  <v-autocomplete>
    <template #item="{ item }">
      <div>{{ item.value }}</div>
    </template>
  </v-autocomplete>
</template>`,
      errors: [{ messageId: 'internalAccess', data: { name: 'item', prop: 'value' } }],
    },
    // item.props
    {
      code:
`<template>
  <v-combobox>
    <template #item="{ item }">
      <v-list-item v-bind="item.props" />
    </template>
  </v-combobox>
</template>`,
      errors: [{ messageId: 'internalAccess', data: { name: 'item', prop: 'props' } }],
    },
    // item.raw.name → item.name (auto-fixed)
    {
      code:
`<template>
  <v-select>
    <template #item="{ item }">
      <div>{{ item.raw.name }}</div>
    </template>
  </v-select>
</template>`,
      output:
`<template>
  <v-select>
    <template #item="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </v-select>
</template>`,
      errors: [{ messageId: 'removeDotRaw' }],
    },
    // Multiple issues on same element
    {
      code:
`<template>
  <v-select>
    <template #item="{ item }">
      <div :title="item.title">{{ item.value }}</div>
    </template>
  </v-select>
</template>`,
      errors: [
        { messageId: 'internalAccess', data: { name: 'item', prop: 'title' } },
        { messageId: 'internalAccess', data: { name: 'item', prop: 'value' } },
      ],
    },
    // selection slot too
    {
      code:
`<template>
  <v-select>
    <template #selection="{ item }">
      <span>{{ item.title }}</span>
    </template>
  </v-select>
</template>`,
      errors: [{ messageId: 'internalAccess', data: { name: 'item', prop: 'title' } }],
    },
    // Renamed destructuring: { item: myItem }
    {
      code:
`<template>
  <v-select>
    <template #item="{ item: myItem }">
      <div>{{ myItem.title }}</div>
    </template>
  </v-select>
</template>`,
      errors: [{ messageId: 'internalAccess', data: { name: 'myItem', prop: 'title' } }],
    },
  ],
})
