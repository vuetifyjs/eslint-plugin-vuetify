'use strict'

module.exports = {
  configs: {
    base: require('./configs/base'),
    migration: require('./configs/migration')
  },
  rules: {
    'grid-unknown-attributes': require('./rules/grid-unknown-attributes')
  }
}
