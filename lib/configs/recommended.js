'use strict'

module.exports = {
  extends: require.resolve('./base'),
  rules: {
    'vuetify/no-legacy-grid': 'error',
    'vuetify/grid-unknown-attributes': 'error'
  }
}
