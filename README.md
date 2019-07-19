# eslint-plugin-vuetify

### WIP

Built for https://github.com/vuetifyjs/vuetify/pull/7327, requires vuetify >=2.0.0-beta.9

All you need to care about for now is
```
$ yarn add -D eslint-plugin-vuetify
```
```js
// .eslintrc.js
plugins: [
  'vuetify'
],
rules: {
  'vuetify/no-deprecated-classes': 'error'
}
```

---

If you want to update to the new grid system too then add
```js
'vuetify/grid-unknown-attributes': 'error',
'vuetify/no-legacy-grid': 'error',
```
