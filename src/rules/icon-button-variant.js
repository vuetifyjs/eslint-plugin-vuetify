'use strict'

const { classify, getAttributes } = require('../util/helpers')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Ensure icon buttons have a variant defined.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [
      { type: 'string' },
    ],
    messages: {
      needsVariant: 'Icon buttons should have {{ a }} defined.',
    },
  },

  create (context) {
    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)
        if (tag !== 'VBtn') return

        const attributes = getAttributes(element)
        const iconAttribute = attributes.find(attr => attr.name === 'icon')
        if (!iconAttribute) return
        if (attributes.some(attr => attr.name === 'variant')) return

        const variant = `variant="${context.options[0] || 'text'}"`

        context.report({
          node: iconAttribute.node,
          messageId: 'needsVariant',
          data: { a: variant },
          fix (fixer) {
            return fixer.insertTextAfter(iconAttribute.node, ' ' + variant)
          },
        })
      },
    })
  },
}
