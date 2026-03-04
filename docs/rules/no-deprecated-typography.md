# Disallow deprecated MD2 typography classes (no-deprecated-typography)

:wrench: This rule is fixable with `eslint --fix`

Vuetify 4 replaces the MD2 typography classes (e.g. `text-h1`) with MD3 equivalents (e.g. `text-display-large`).

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="text-h1">Heading</div>
<div class="text-subtitle-1">Subtitle</div>
<div class="text-caption">Caption</div>
```

Examples of **correct** code for this rule:

```html
<div class="text-display-large">Heading</div>
<div class="text-body-large">Subtitle</div>
<div class="text-body-small">Caption</div>
```

### Options

This rule accepts an optional object mapping class names to their replacements. Set a class to `false` to disable it.

```js
// Use default MD3 mappings (text-h1 -> text-display-large, etc.)
'vuetify/no-deprecated-typography': 'error' // defaults to MD2 -> MD3 migration

// Conservative mappings — disables ambiguous entries where two MD2 classes
// map to the same MD3 class, so you can review those manually:
'vuetify/no-deprecated-typography': ['error', {
  'text-h1': 'text-display-large',
  'text-h2': 'text-display-medium',
  'text-h3': 'text-display-small',
  'text-h4': 'text-headline-large',
  'text-h5': 'text-headline-medium',
  'text-h6': 'text-headline-small',
  'text-subtitle-1': 'text-body-large', // same as text-body-1, switch to "false" to force manual action
  'text-subtitle-2': 'text-label-large', // same as text-button, switch to "false" to force manual action
  'text-body-1': 'text-body-large',
  'text-body-2': 'text-body-medium',
  'text-caption': 'text-body-small',
  'text-button': 'text-label-large',
  'text-overline': 'text-label-small',
}]

// Custom mapping
'vuetify/no-deprecated-typography': ['error', { 'text-h1': 'my-heading-xl' }]

// Different preset
'vuetify/no-deprecated-typography': ['error', 'md2'] // mapping MD1 -> MD2
```
