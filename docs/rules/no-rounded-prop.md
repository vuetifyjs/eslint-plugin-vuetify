# Disallow the rounded prop (no-rounded-prop)

:wrench: This rule is fixable with `eslint --fix`

When migrating to TailwindCSS, the Vuetify `rounded` prop should be replaced with Tailwind rounded utility classes.

## Rule Details

Examples of **incorrect** code for this rule:

```html
<v-card rounded />
<v-card rounded="lg" />
<v-card rounded="circle" />
<v-card rounded="shaped" />
```

Examples of **correct** code for this rule:

```html
<v-card class="rounded" />
<v-card class="rounded-lg" />
<v-card class="rounded-full" />
<v-card class="rounded-te-xl rounded-bs-xl" />
```

### Rounded to Tailwind Mapping

| Rounded Value | Tailwind Class                |
|---------------|-------------------------------|
| (boolean)     | `rounded`                     |
| `0`           | `rounded-none`                |
| `sm`          | `rounded-sm`                  |
| `lg`          | `rounded-lg`                  |
| `xl`          | `rounded-xl`                  |
| `circle`      | `rounded-full`                |
| `pill`        | `rounded-full`                |
| `shaped`      | `rounded-te-xl rounded-bs-xl` |

### Options

This rule has no configuration options.
