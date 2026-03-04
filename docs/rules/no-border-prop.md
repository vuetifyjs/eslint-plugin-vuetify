# Disallow the border prop (no-border-prop)

:wrench: This rule is fixable with `eslint --fix`

When migrating to TailwindCSS, the Vuetify `border` prop should be replaced with Tailwind border utility classes.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-card border />
<v-card border="t" />
<v-card border="t sm" />
```

Examples of **correct** code for this rule:

```html
<v-card class="border" />
<v-card class="border-t" />
<v-card class="border-t border-sm" />
```

### Options

This rule has no configuration options.
