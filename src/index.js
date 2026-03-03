'use strict'
const path = require('path')
const requireindex = require('requireindex')

module.exports = {
  configs: {
    base: require('./configs/base'),
    recommended: require('./configs/recommended'),
    'recommended-v4': require('./configs/recommended-v4'),

    'flat/base': require('./configs/flat/base'),
    'flat/recommended': require('./configs/flat/recommended'),
    'flat/recommended-v4': require('./configs/flat/recommended-v4'),
  },
  rules: requireindex(path.join(__dirname, './rules')),
}
