# Prevent the use of deprecated import paths (no-deprecated-imports)

:wrench: This rule is fixable with `eslint --fix`

## Rule Details

Imports from deprecated paths (e.g. `vuetify/lib/util/colors`) are reported and fixed to the current path (`vuetify/util/colors`).

Examples of **incorrect** code for this rule:

```js
import { red } from 'vuetify/lib/util/colors'
```

Examples of **correct** code for this rule:

```js
import { red } from 'vuetify/util/colors'
```

### Options

This rule has no configuration options.
