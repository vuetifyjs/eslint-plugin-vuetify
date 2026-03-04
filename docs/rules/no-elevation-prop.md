# Disallow the elevation prop (no-elevation-prop)

:wrench: This rule is fixable with `eslint --fix`

The Vuetify `elevation` prop should be replaced with the equivalent `elevation-{N}` utility class.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-card elevation="2" />
<v-card elevation="4" />
<v-card :elevation="3" />
```

Examples of **correct** code for this rule:

```html
<v-card class="elevation-2" />
<v-card class="elevation-4" />
<v-card class="elevation-3" />
```

Values 0–5 are auto-fixable. Dynamic or out-of-range values are reported without a fix.

### Options

This rule has no configuration options.
