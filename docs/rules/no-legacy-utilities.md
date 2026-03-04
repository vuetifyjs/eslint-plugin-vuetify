# Disallow Vuetify utility classes (no-legacy-utilities)

:wrench: This rule is fixable with `eslint --fix`

When migrating to TailwindCSS, Vuetify utility classes should be replaced with their Tailwind equivalents.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="d-flex align-center justify-space-between" />
<div class="ma-2 pa-4" />
<div class="font-weight-bold text-truncate" />
```

Examples of **correct** code for this rule:

```html
<div class="flex items-center justify-between" />
<div class="m-2 p-4" />
<div class="font-bold truncate" />
```

### Options

This rule accepts an optional object mapping class names to their replacements. Set a class to `false` to disable it.

```js
// Use all default mappings
'vuetify/no-legacy-utilities': 'error'

// Override specific mappings
'vuetify/no-legacy-utilities': ['error', {
  'd-flex': 'my-flex',
  'ma-2': false, // disable this mapping
}]
```
