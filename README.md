# eslint-plugin-vuetify

This package is for migrating from Vuetify v2 to v3, use [eslint-plugin-vuetify@vuetify-2](https://www.npmjs.com/package/eslint-plugin-vuetify/v/vuetify-2) for v1 to v2.

<br>

<p align="center">Support the maintainer of this plugin:</p>
<h4 align="center">Kael Watts-Deuchar</h4>

<p align="center">
  <a href="https://www.patreon.com/kaelwd">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

## 💿 Install

You should have [`eslint`](https://eslint.org/docs/user-guide/getting-started) and [`eslint-plugin-vue`](https://eslint.vuejs.org/user-guide/#installation) set up first.

```bash
yarn add eslint-plugin-vuetify -D
# OR
npm install eslint-plugin-vuetify --save-dev
```

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/base',
    'plugin:vuetify/base'
  ]
}
```

**NOTE** This plugin does not affect _**pug**_ templates due to [a limitation in vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser/issues/29). I suggest converting your pug templates to HTML with [pug-to-html](https://github.com/leo-buneev/pug-to-html) in order to use this plugin.


## Rules

### Deprecations

These rules will help you avoid deprecated components, props, and classes. They are included in the `plugin:vuetify/base` preset.

- Prevent the use of components that have been removed from Vuetify ([`no-deprecated-components`])
- Prevent the use of props that have been removed from Vuetify ([`no-deprecated-props`])
- Prevent the use of events that have been removed from Vuetify ([`no-deprecated-events`])
- Prevent the use of classes that have been removed from Vuetify ([`no-deprecated-classes`])
- Prevent the use of the old theme class syntax ([`no-deprecated-colors`])
- Prevent the use of deprecated import paths ([`no-deprecated-imports`])
- Ensure icon buttons have a variant defined ([`icon-button-variant`])

### Grid system

These rules are designed to help migrate to the new grid system in Vuetify v2. They are included in the `plugin:vuetify/recommended` preset.

- Warn about unknown attributes not being converted to classes on new grid components ([`grid-unknown-attributes`])


[`grid-unknown-attributes`]: ./docs/rules/grid-unknown-attributes.md
[`no-deprecated-components`]: ./docs/rules/no-deprecated-components.md
[`no-deprecated-props`]: ./docs/rules/no-deprecated-props.md
[`no-deprecated-events`]: ./docs/rules/no-deprecated-events.md
[`no-deprecated-classes`]: ./docs/rules/no-deprecated-classes.md
[`no-deprecated-colors`]: ./docs/rules/no-deprecated-colors.md
[`no-deprecated-imports`]: ./docs/rules/no-deprecated-imports.md
[`icon-button-variant`]: ./docs/rules/icon-button-variant.md


## 💪 Supporting Vuetify
<p>Vuetify is an open source MIT project that has been made possible due to the generous contributions by <a href="https://github.com/vuetifyjs/vuetify/blob/dev/BACKERS.md">community backers</a>. If you are interested in supporting this project, please consider:</p>

<ul>
  <li>
    <a href="https://github.com/sponsors/kaelwd">Becoming a sponsor on Github</a>
    <strong><small>(supports Kael)</small></strong>
  </li>
  <li>
    <a href="https://opencollective.com/vuetify">Becoming a backer on OpenCollective</a>
    <strong><small>(supports the Dev team)</small></strong>
  </li>
  <li>
    <a href="https://tidelift.com/subscription/npm/vuetify?utm_source=vuetify&utm_medium=referral&utm_campaign=readme">Become a subscriber on Tidelift</a>
  </li>
  <li>
    <a href="https://paypal.me/vuetify">Make a one-time payment with Paypal</a>
  </li>
  <li>
    <a href="https://vuetifyjs.com/getting-started/consulting-and-support?ref=github">Book time with John</a>
  </li>
</ul>

### 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Vuetify LLC
