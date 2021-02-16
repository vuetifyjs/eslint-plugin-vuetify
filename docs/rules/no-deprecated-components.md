# Disallow the use of components that have been removed from Vuetify (no-deprecated-components)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule disallows the use of removed and deprecated components. Grid components are not included in this rule, use [`no-legacy-grid`](./no-legacy-grid.md) instead.

Examples of **incorrect** code for this rule:

```html
<v-content>
  <v-list-tile>
    <v-list-tile-title></v-list-tile-title>
  </v-list-tile>
</v-content>

<v-jumbotron></v-jumbotron>
```

Examples of **correct** code for this rule:

```js
<v-main>
  <v-list-item>
    <v-list-item-title></v-list-item-title>
  </v-list-item>
</v-main>
```

### Options

This rule has no configuration options.
