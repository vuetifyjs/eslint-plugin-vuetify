# Disallow deprecated props and slots on Vuetify snackbar components (no-deprecated-snackbar)

:wrench: This rule is fixable with `eslint --fix`

In Vuetify 4, `VSnackbar`'s `multi-line` prop has been replaced with `min-height="68"`, and `VSnackbarQueue`'s `#default` slot has been renamed to `#item`.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-snackbar multi-line />

<v-snackbar-queue>
  <template #default="{ item }">
    <v-snackbar v-bind="item" />
  </template>
</v-snackbar-queue>
```

Examples of **correct** code for this rule:

```html
<v-snackbar min-height="68" />

<v-snackbar-queue>
  <template #item="{ item }">
    <v-snackbar v-bind="item" />
  </template>
</v-snackbar-queue>
```

### Options

This rule has no configuration options.
