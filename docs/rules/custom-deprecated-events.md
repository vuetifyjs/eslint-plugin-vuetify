# Disallow usage of specified component events (custom-deprecated-events)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule lets you deprecate specific events on specific components, with optional replacements. It has no defaults and requires a configuration object. This is the user-configurable counterpart to `no-deprecated-events`.

### Options

The rule takes a single object where each key is a component name (PascalCase or kebab-case) and the value is an object mapping event names to replacements:

- A **string** replacement name (auto-fixable rename)
- **`false`** to mark the event as removed with no replacement
- An **object** with a `message` property for a custom explanation (report only, no auto-fix)

```js
{
  'vuetify/custom-deprecated-events': ['error', {
    VRadio: {
      // does not emit this event for some reason, click is a good replacement
      'update:modelValue': 'click',
    },
    VDialog: {
      // v2 » v3 migration, not sure why we did not cover this
      'click:outside': false,
    },
    MyUploadButton: {
      // maybe you did refactoring and want ESLint to aid the migration
      done: { message: 'Use @success or @error instead' },
    },
  }]
}
```

Examples of **incorrect** code for this rule (with the configuration above):

```html
<v-radio @update:model-value="handler" />
<v-dialog @click:outside="handler" />
<my-upload-button @done="handler" />
```

Examples of **correct** code for this rule:

```html
<v-radio @click="handler" />
```
