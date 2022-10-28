# Disallow the use of the old color class structure (no-deprecated-colors)

:wrench: This rule is fixable with `eslint --fix`

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-btn color="primary darken-1">
<div class="primary"></div>
<div class="primary--text"></div>
<div class="primary--text text--darken-1"></div>
```

Examples of **correct** code for this rule:

```js
<v-btn color="primary">
<v-btn color="primary-darken-1">
<div class="bg-primary"></div>
<div class="text-primary"></div>
<div class="text-primary-darken-1"></div>
```

### Options

Additional custom theme colors can be added to the rule configuration:

```js
{
  'vuetify/no-deprecated-colors': ['error', {
    themeColors: ['tertiary']
  }]
}
```
