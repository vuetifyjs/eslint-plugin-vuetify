'use strict'

const loadModule = require('../util/load-module')
const { hyphenate, classify, getAttributes } = require('../util/helpers')
const { isGridAttribute } = require('../util/grid-attributes')
const { addClass, removeAttr } = require('../util/fixers')

const VGrid = {
  VContainer: loadModule('vuetify/es5/components/VGrid/VContainer').default,
  VRow: loadModule('vuetify/es5/components/VGrid/VRow').default,
  VCol: loadModule('vuetify/es5/components/VGrid/VCol').default
}

const tags = Object.keys(VGrid).reduce((t, k) => {
  t[classify(k)] = Object.keys(VGrid[k].options.props).map(p => hyphenate(p)).sort()

  return t
}, {})

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'warn about unknown attributes not being converted to classes on new grid components',
      category: 'recommended'
    },
    fixable: 'code',
    schema: []
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)
        if (!Object.keys(tags).includes(tag)) return

        const attributes = getAttributes(element).filter(({ name }) => {
          return !tags[tag].includes(name) && !isGridAttribute(tag, name)
        })

        if (attributes.length) {
          context.report({
            node: element.startTag,
            loc: {
              start: attributes[0].node.loc.start,
              end: attributes[attributes.length - 1].node.loc.end
            },
            message: 'Attributes are no longer converted into classes',
            fix (fixer) {
              const fixableAttrs = attributes.map(({ node }) => node)
                .filter(attr => !attr.directive)

              if (!fixableAttrs.length) return

              const className = fixableAttrs.map(node => node.key.rawName).join(' ')
              return [
                addClass(context, fixer, element, className),
                ...fixableAttrs.map(removeAttr.bind(this, context, fixer))
              ]
            }
          })
        }
      }
    })
  }
}
