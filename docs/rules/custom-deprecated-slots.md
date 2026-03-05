# Disallow usage of specified component slots (custom-deprecated-slots)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule lets you deprecate specific slots on specific components, with optional replacements. It has no defaults and requires a configuration object. This is the user-configurable counterpart to `no-deprecated-slots`.

### Options

The rule takes a single object where each key is a component name (PascalCase or kebab-case) and the value is an object mapping slot names to replacements:

- A **string** replacement name (auto-fixable rename)
- **`false`** to mark the slot as removed with no replacement
- An **object** with a `message` property for a custom explanation (report only, no auto-fix)

```js
{
  'vuetify/custom-deprecated-slots': ['error', {
    VSnackbar: {
      // Rename slot (auto-fixable)
      action: 'actions',
    },
    MyGalleryCard: {
      // Removed with generic message, assuming you communicated this to your team
      title: false,
    },
    VMenu: {
      // Removed with suggestion
      activator: { message: 'Prefer v-model or activator="parent" instead' },
    },
  }]
}
```

Examples of **incorrect** code for this rule (with the configuration above):

```html
<v-snackbar>
  <template #action>...</template>
</v-snackbar>

<my-gallery-card>
  <template #title>...</template>
</my-gallery-card>

<v-menu>
  <template #activator="{ props }">...</template>
</v-menu>
```

Examples of **correct** code for this rule:

```html
<v-snackbar>
  <template #actions>...</template>
</v-snackbar>

<v-btn>
  Open
  <v-menu activator="parent">...</v-menu>
</v-btn>
```
