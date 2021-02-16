# Prevent the use of legacy grid components and props (no-legacy-grid)

:wrench: This rule is fixable with `eslint --fix`

Vuetify v2 introduced a new set of grid components: https://vuetifyjs.com/en/components/grids/

## Rule Details

This rule helps migrate from v-layout/v-flex to v-row/v-col and prevents accidental use of old grid props on the new grid components. It will not prevent the use of extra attributes on the new grid components, see `grid-unknown-attributes`

Examples of **incorrect** code for this rule:

```html
<v-layout row wrap justify-center>
  <v-flex xs12 md6 sm4 lg2></v-flex>
</v-layout>

<v-col xs12></v-col>

<v-container grid-list-md></v-container>

<v-layout column></v-layout>
```

Examples of **correct** code for this rule:

```js
<v-row justify="center">
  <v-col cols="12" md="6" sm="4" lg="2"></v-flex>
</v-layout>

<v-col cols="12"></v-col>
```

### Options

This rule has no configuration options.

## When Not To Use It

Do not use this rule if you still rely on v-layout and v-flex in your application. The new grid system is still optional in Vuetify 2 and the old components should continue to work.
