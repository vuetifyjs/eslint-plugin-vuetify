# eslint-plugin-vuetify (WIP)

<p align="center">
  <a href="https://www.patreon.com/kaelwd">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
  </a>
</p>

Built for https://github.com/vuetifyjs/vuetify/pull/7327, requires vuetify >=2.0.0-beta.9

All you need to care about for now is
```bash
$ yarn add -D eslint-plugin-vuetify
# or
$ npm install -D eslint-plugin-vuetify
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

**NOTE** This plugin does not affect _**pug**_ templates due to [a limitation in vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser/issues/29). If there's demand for it I'll make one to convert pug to html too. 

---

If you want to update to the new grid system too then add
```js
'vuetify/grid-unknown-attributes': 'error',
'vuetify/no-legacy-grid': 'error',
```
to your rules.
