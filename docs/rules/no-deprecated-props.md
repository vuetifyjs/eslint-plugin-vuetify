# Prevent the use of removed and deprecated props (no-deprecated-props)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-btn outlined />
```

Examples of **correct** code for this rule:

```html
<v-btn variant="outlined" />
```

### Options

This rule has no configuration options.
