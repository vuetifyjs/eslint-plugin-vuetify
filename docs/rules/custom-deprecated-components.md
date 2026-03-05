# Disallow usage of specified components (custom-deprecated-components)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule lets you deprecate specific components from being used in templates, with optional replacements. It has no defaults and requires a configuration object.

Use cases include:
- Replacing Vuetify grid components with Tailwind CSS utility classes
- Prohibiting components you have wrapped and standardized
- Blocking components that are overused or misused (e.g. by AI code generation)

### Options

The rule takes a single object where each key is a component name (PascalCase or kebab-case) and the value is either:

- A **string** replacement using dot notation: the first segment is the replacement tag and subsequent segments are CSS classes to add (e.g. `"div.grid.grid-cols-12"` produces `<div class="grid grid-cols-12">`). Auto-fixable.
- An **object** with a `message` property for a custom error message (report only, no auto-fix)
- **`false`** to deprecate the component with no auto-fix and a generic message

```js
{
  'vuetify/custom-deprecated-components': ['error', {
    // Replace with a tag + classes (auto-fixable)
    VRow: 'div.grid.grid-cols-12',
    VCol: 'div.pa-3.col-span-4',

    // Simple tag replacement (auto-fixable)
    VCard: 'app-card',

    // Deprecate with a custom message (report only)
    VSnackbar: { message: 'Use <AppSnackbar> from @/components instead' },

    // Deprecate with no replacement (report only)
    VBottomSheet: false,
  }]
}
```

Examples of **incorrect** code for this rule (with the configuration above):

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

The error messages are human-readable:
- String replacement: `'v-row' is deprecated, use '<div class="grid grid-cols-12">' instead`
- Custom message: `'v-snackbar' is deprecated: Use <AppSnackbar> from @/components instead`
- False: `'v-bottom-sheet' is deprecated`

When a replacement includes classes and the element already has a `class` attribute, the new classes are appended to the existing value.
