'use strict'
const pluginVuetify = require('../../index')

module.exports = {

  files: ['*.vue', '**/*.vue'],
  plugins: {
    vuetify: pluginVuetify,
  },
  rules: {
    ...pluginVuetify.configs.base.rules,
  },
}
