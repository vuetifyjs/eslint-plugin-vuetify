# Prevent the use of removed and deprecated props (no-deprecated-props)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

Grid components are not included in this rule, use [`no-legacy-grid`](./no-legacy-grid.md) instead.

Examples of **incorrect** code for this rule:

```html
<v-btn outline round />
<v-carousel hide-controls />
<v-toolbar app manual-scroll />
```

Examples of **correct** code for this rule:

```html
<v-btn outlined rounded />
<v-carousel :show-arrows="false" />
<v-app-bar app :value="false" />
```

### Options

This rule has no configuration options.
