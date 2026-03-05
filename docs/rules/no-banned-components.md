# Disallow usage of specified components (no-banned-components)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule lets you ban specific components from being used in templates, with optional replacements. It has no defaults and requires a configuration object.

Use cases include:
- Replacing Vuetify grid components with Tailwind CSS utility classes
- Prohibiting components you have wrapped and standardized
- Blocking components that are overused or misused (e.g. by AI code generation)

Examples of **incorrect** code for this rule (with the configuration below):

```html
<v-row>
  <v-col>...</v-col>
</v-row>

<v-snackbar />
```

Examples of **correct** code for this rule:

```html
<div class="grid grid-cols-12">
  <div class="pa-3 col-span-4">...</div>
</div>
```

### Options

The rule takes a single object where each key is a component name (PascalCase or kebab-case) and the value is either:

- A **string** replacement using dot notation: the first segment is the replacement tag and subsequent segments are CSS classes to add (e.g. `"div.grid.grid-cols-12"` produces `<div class="grid grid-cols-12">`)
- **`false`** to ban the component with no auto-fix

```js
{
  'vuetify/no-banned-components': ['error', {
    // Replace with a tag + classes (auto-fixable)
    VRow: 'div.grid.grid-cols-12',
    VCol: 'div.pa-3.col-span-4',

    // Simple tag replacement (auto-fixable)
    VCard: 'app-card',

    // Ban with no replacement (report only)
    VSnackbar: false,
  }]
}
```

When a replacement includes classes and the element already has a `class` attribute, the new classes are appended to the existing value.
