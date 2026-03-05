# Disallow usage of specified component props (custom-deprecated-props)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule lets you deprecate specific props on specific components, with optional replacements. It has no defaults and requires a configuration object. This is the user-configurable counterpart to `no-deprecated-props`.

### Options

The rule takes a single object where each key is a component name (PascalCase or kebab-case) and the value is an object mapping prop names to replacements:

- A **string** replacement name (auto-fixable rename)
- **`false`** to mark the prop as removed with no replacement
- An **object** with a `message` property for a custom explanation (report only, no auto-fix)

```js
{
  'vuetify/custom-deprecated-props': ['error', {
    MyCustomCard: {
      // if you need a little help during internal refactoring
      loading: 'loader',
    },
    VTabs: {
      // let's say it is standardized by the defaults and should not be repeated
      sliderColor: false,
    },
    MyUploadButton: {
      // enforce the standardization, aid your colleagues and careless AI tools
      prependIcon: { message: 'Use upload-type instead' },
    },
  }]
}
```

Examples of **incorrect** code for this rule (with the configuration above):

```html
<my-custom-card loading />
<my-custom-card :loading="true" />
<v-tabs v-model="current" slider-color="primary" />
<my-upload-button prepend-icon="i-tabler:folder-up" />
```

Examples of **correct** code for this rule:

```html
<my-custom-card loader />
<my-custom-card :loader="true" />
<v-tabs v-model="current" />
<my-upload-button upload-type="folder" />
```
