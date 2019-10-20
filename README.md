# eslint-plugin-vuetify (WIP)
> An eslint plugin for Vuetify.
> Built for https://github.com/vuetifyjs/vuetify/pull/7327, requires vuetify >=2.0.0-beta.9

<br>

<p align="center">Support the maintainer of this plugin:</p>
<h4 align="center">Kael Watts-Deuchar</h4>

<p align="center">
  <a href="https://www.patreon.com/kaelwd">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

### 💿 Install
```bash
yarn add eslint-plugin-vuetify -D
# OR
npm install eslint-plugin-vuetify --save-dev
```

```js
// .eslintrc.js
module.exports = {
  plugins: [
    'vuetify'
  ],
  rules: {
    'vuetify/no-deprecated-classes': 'error'
  }
}
```

**NOTE** This plugin does not affect _**pug**_ templates due to [a limitation in vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser/issues/29). I suggest converting your pug templates to HTML with [pug-to-html](https://github.com/leo-buneev/pug-to-html) in order to use this plugin.


### 🚀 Usage

Add the **grid-unknown-attributes** and **no-legacy-grid** rules and the plugin will automatically update your templates.

```js
// .eslintrc.js

'vuetify/grid-unknown-attributes': 'error',
'vuetify/no-legacy-grid': 'error',
```
### 💪 Supporting Vuetify
<p>Vuetify is an open source MIT project that has been made possible due to the generous contributions by <a href="https://github.com/vuetifyjs/vuetify/blob/dev/BACKERS.md">community backers</a>. If you are interested in supporting this project, please consider:</p>

<ul>
  <li>
    <a href="https://github.com/users/johnleider/sponsorship">Becoming a sponsor on Github</a>
    <strong><small>(supports John)</small></strong>
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
