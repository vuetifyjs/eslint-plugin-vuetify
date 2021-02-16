# Disallow the use of classes that have been removed from Vuetify (no-deprecated-classes)

:wrench: This rule is fixable with `eslint --fix`

Vuetify v2 and v2.3 changed several utility classes (documented [here](https://vuetifyjs.com/en/getting-started/upgrade-guide/#grid)).


## Rule Details

This rule disallows the use of removed utility classes.

Some of the changes cannot be detected automatically, you should apply these yourself:

- Change spacing helpers to intervals of 4px
  - ma-3 -> ma-4
  - ma-4 -> ma-6
  - ma-5 -> ma-12

Examples of **incorrect** code for this rule:

```html
<div class="text-xs-left"></div>
<div class="left"></div>
<v-container scroll-y></v-container>
```

Examples of **correct** code for this rule:

```js
<div class="text-left"></div>
<div class="float-left"></div>
<v-container overflow-y-visible></v-container>
```

### Options

This rule has no configuration options.
