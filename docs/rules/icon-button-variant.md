# Ensure icon buttons have a variant defined (icon-button-variant)

:wrench: This rule is fixable with `eslint --fix`

## Rule Details

Buttons in Vuetify 3 no longer have a different variant applied automatically.

Examples of **incorrect** code for this rule:

```html
<v-btn icon />
<v-btn icon="search" />
```

Examples of **correct** code for this rule:

```js
<v-btn icon variant="text" />
<v-btn icon="search" variant="text" />
```

### Options

A different variant other than `text` can be assigned:

```js
{
  'vuetify/icon-button-variant': ['error', 'plain']
}
```
