# Disallow elevation classes above the MD3 maximum (no-elevation-overflow)

Vuetify 4 follows the MD3 elevation scale which only supports levels 0 through 5. This rule flags any elevation class or prop that exceeds this maximum.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<div class="elevation-6" />
<div class="elevation-24" />
<v-card elevation="12" />
<v-card :elevation="20" />
```

Examples of **correct** code for this rule:

```html
<div class="elevation-3" />
<div class="elevation-5" />
<v-card elevation="4" />
<v-card :elevation="3" />
```

### Options

This rule has no configuration options.
