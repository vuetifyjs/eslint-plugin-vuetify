'use strict'

const loadModule = require('../util/load-module')
const { hyphenate, classify, isBuiltinAttribute } = require('../util/helpers')
const { isGridAttribute } = require('../util/grid-attributes')

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

        const attributes = element.startTag.attributes.filter(node => {
          if (node.directive && (node.key.name !== 'bind' || !node.key.argument)) return

          const name = hyphenate(node.directive ? node.key.argument : node.key.rawName)

          return !isBuiltinAttribute(name) &&
            !tags[tag].includes(name) &&
            !isGridAttribute(tag, name)
        })

        if (attributes.length) {
          context.report({
            node: element.startTag,
            loc: {
              start: attributes[0].loc.start,
              end: attributes[attributes.length - 1].loc.end
            },
            message: 'Attributes are no longer converted into classes',
            fix (fixer) {
              const fixableAttrs = attributes.filter(attr => !attr.directive)

              if (!fixableAttrs.length) return

              const className = fixableAttrs.map(node => node.key.rawName).join(' ')
              const source = context.getSourceCode().text
              const removeAttrs = fixableAttrs.map(node => {
                let [start, end] = node.range
                // Also remove whitespace after attributes
                if (/\s/.test(source[end])) ++end
                return fixer.removeRange([start, end])
              })
              const classNode = element.startTag.attributes.find(attr => attr.key.name === 'class')

              if (classNode) {
                return [
                  fixer.replaceText(classNode.value, `"${classNode.value.value} ${className}"`),
                  ...removeAttrs
                ]
              } else {
                return [
                  fixer.insertTextAfter(
                    context.parserServices.getTemplateBodyTokenStore().getFirstToken(element.startTag),
                    ` class="${className}"`
                  ),
                  ...removeAttrs
                ]
              }
            }
          })
        }
      }
    })
  }
}
