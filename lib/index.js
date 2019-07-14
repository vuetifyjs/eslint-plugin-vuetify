'use strict'
const path = require('path')
const requireindex = require('requireindex')

module.exports = {
  configs: requireindex(path.join(__dirname, './configs')),
  rules: requireindex(path.join(__dirname, './rules'))
}
