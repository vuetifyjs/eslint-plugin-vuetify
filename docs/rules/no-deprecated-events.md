# Disallow the use of events that have been removed from Vuetify (no-deprecated-events)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

This rule disallows the use of removed and deprecated events. 

Examples of **incorrect** code for this rule:

```html
<v-text-field @input="onInput" />
<v-btn @change="onSelected" />
```

Examples of **correct** code for this rule:

```html
<v-text-field @update:model-value="onInput" />
<v-btn @group:selected="onSelected" />
```

### Options

This rule has no configuration options.
