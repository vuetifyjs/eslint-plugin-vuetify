'use strict'

const loadModule = require('../util/load-module')
const { hyphenate, isBuiltinAttribute } = require('../util/helpers')

const VGrid = loadModule('vuetify/es5/components/VGrid').default

const tags = Object.keys(VGrid).reduce((t, k) => {
  t[hyphenate(k)] = Object.keys(VGrid[k].options.props).map(p => hyphenate(p)).sort()

  return t
}, {})

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of v-html to prevent XSS attack',
      category: 'recommended',
      url: 'https://eslint.vuejs.org/rules/no-v-html.html'
    },
    fixable: 'code',
    schema: []
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        const tag = hyphenate(node.rawName)
        if (!Object.keys(tags).includes(tag)) return

        node.startTag.attributes.forEach(node => {
          if (node.directive && (node.key.name !== 'bind' || !node.key.argument)) return

          const name = node.directive ? node.key.argument : node.key.rawName

          if (
            !isBuiltinAttribute(name) &&
            !tags[tag].includes(name)
          ) {
            context.report({
              node,
              loc: node.loc,
              message: 'Attributes are no longer converted into classes',
              fix (fixer) {
                if (node.directive) return
                let classNode = node.parent.attributes.find(attr => attr.key.name === 'class')

                if (classNode) {
                  return [
                    fixer.replaceText(classNode.value, `"${classNode.value.value} ${name}"`),
                    fixer.remove(node)
                  ]
                } else {
                  return fixer.replaceText(node, `class="${name}"`)
                }
              }
            })
          }
        })
      }
    })
  }
}
