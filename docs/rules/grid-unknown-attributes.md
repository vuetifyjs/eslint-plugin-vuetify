# warn about unknown attributes not being converted to classes on new grid components (grid-unknown-attributes)

:wrench: This rule is fixable with `eslint --fix`

The new grid system in Vuetify v2 no longer converts unrecognised attributes into classes.

## Rule Details

This rule prevents the use of non-prop attributes on `v-container`, `v-row`, and `v-col`. It will not transform legacy grid props on the new components, for that use the `no-legacy-grid` rule.

Examples of **incorrect** code for this rule:

```html
<v-container fill-height></v-container>
```

Examples of **correct** code for this rule:

```js
<v-container class="fill-height">
<v-col xs12></v-col>
```

### Options

This rule has no configuration options.
