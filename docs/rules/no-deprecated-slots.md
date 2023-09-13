# Prevent the use of removed slot variables (no-deprecated-slots)

:wrench: This rule is partially fixable with `eslint --fix`

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-dialog>
  <template #activator="{ on }">
    <v-btn v-on="on" />
  </template>
</v-dialog>
```

Examples of **correct** code for this rule:

```html
<v-dialog>
  <template #activator="{ props }">
    <v-btn v-bind="props" />
  </template>
</v-dialog>
```

Variable shadowing is not currently handled, the following will produce incorrect output that must be fixed manually:

```html
<v-menu>
  <template #activator="{ on: menuOn }">
    <v-tooltip>
      <template #activator="{ on: tooltipOn }">
        <v-btn v-on="{ ...tooltipOn, ...menuOn }" />
      </template>
    </v-tooltip>
  </template>
</v-menu>
```

### Options

This rule has no configuration options.
