'use strict'

const { hyphenate, classify, getAttributes } = require('../util/helpers')

const replacements = {
  components: {
    VLayout: 'v-row',
    VFlex: 'v-col'
  },
  attrs: new Map([
    [/^align-self-(start|baseline|center|end)$/, ([align]) => `align-self="${align}"`],
    [/^(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `${bp === 'xs' ? 'cols' : bp}="${size}"`],
    [/^offset-(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `offset${bp === 'xs' ? '' : `-${bp}`}="${size}"`],
    [/^order-(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `order${bp === 'xs' ? '' : `-${bp}`}="${size}"`]
  ])
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: '',
      category: 'recommended'
    },
    fixable: 'code',
    schema: []
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)
        const tokens = context.parserServices.getTemplateBodyTokenStore()
        if (replacements.components[tag]) {
          context.report({
            node: element,
            message: 'Don\'t use deprecated grid components',
            fix (fixer) {
              const open = tokens.getFirstToken(element.startTag)
              const endTag = element.endTag
              if (!endTag) {
                return fixer.replaceText(open, `<${replacements.components[tag]}`)
              }
              const endTagOpen = tokens.getFirstToken(endTag)
              return [
                fixer.replaceText(open, `<${replacements.components[tag]}`),
                fixer.replaceText(endTagOpen, `</${replacements.components[tag]}`)
              ]
            }
          })
        }

        getAttributes(element).forEach(attr => {
          for (const replacer of replacements.attrs) {
            const matches = (replacer[0].exec(attr.name) || []).slice(1)
            if (matches.length) {
              context.report({
                node: attr.node,
                message: 'Don\'t use deprecated grid components',
                fix (fixer) {
                  return fixer.replaceText(attr.node, replacer[1](matches))
                }
              })
            }
          }
        })
      }
    })
  }
}
