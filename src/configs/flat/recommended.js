'use strict'
const base = require('./base')

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'vuetify/grid-unknown-attributes': 'error',
  },
}
