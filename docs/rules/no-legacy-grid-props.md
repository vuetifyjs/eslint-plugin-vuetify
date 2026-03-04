# Prevent the use of removed grid props (no-legacy-grid-props)

:wrench: This rule is fixable with `eslint --fix`

In Vuetify 4, several `VRow` and `VCol` props have been removed in favor of utility classes or renamed props.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-row align="center" justify="space-between" />
<v-row dense />
<v-col order="2" align-self="center" />
```

Examples of **correct** code for this rule:

```html
<v-row class="align-center justify-space-between" />
<v-row density="compact" />
<v-col class="order-2 align-self-center" />
```

### Options

This rule has no configuration options.
