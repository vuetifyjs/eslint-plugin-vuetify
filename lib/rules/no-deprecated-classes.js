'use strict'

const { hyphenate } = require('../util/helpers')

// const spacers = {
//   0: 0,
//   1: 1,
//   2: 2,
//   3: 4,
//   4: 6,
//   5: 12
// }

const replacements = new Map([
  ['shrink', 'flex-grow-0'],
  ['grow', 'flex-shrink-0']
  // TODO: only run fixer once
  // [/([mp][axytblr])-(\d)/, (type, n) => `${type}-${spacers[n]}`]
])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the use of classes that have been removed from Vuetify'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        const tag = hyphenate(node.rawName)
      }
    })
  }
}
