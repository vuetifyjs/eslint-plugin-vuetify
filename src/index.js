'use strict'
const path = require('path')
const requireindex = require('requireindex')

module.exports = {
  configs: {
    base: require('./configs/base'),
    recommended: require('./configs/recommended'),

    'flat/base': require('./configs/flat/base'),
    'flat/recommended': require('./configs/flat/recommended'),
  },
  rules: requireindex(path.join(__dirname, './rules')),
}
