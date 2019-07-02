'use strict'
const requireindex = require('requireindex')

module.exports = {
  configs: requireindex(__dirname, './configs'),
  rules: requireindex(__dirname, './rules')
}
