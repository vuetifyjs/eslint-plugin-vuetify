'use strict'

const Module = require('module')
const originalLoader = Module._load
Module._load = function _load (request, parent) {
  if (request.endsWith('.sass') || request.endsWith('.scss')) return
  else return originalLoader(request, parent)
}
const VGrid = require('vuetify/es5/components/VGrid').default
Module._load = originalLoader

function hyphenate (str = '') {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

const tags = Object.keys(VGrid).reduce((t, k) => {
  t[hyphenate(k)] = Object.keys(VGrid[k].options.props).map(p => hyphenate(p)).sort()

  return t
}, {})

const specialAttrs = [
  'style', 'class', 'id',
  'contenteditable', 'draggable', 'spellcheck',
  'key', 'ref', 'slot', 'is', 'slot-scope'
]

function isBuiltinAttribute (name) {
  return specialAttrs.includes(name) ||
  name.startsWith('data-') ||
  name.startsWith('aria-')
}

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
    function createVisitor (tag) {
      return function (node) {
        if (node.directive && node.key.name !== 'bind') return

        const name = node.directive ? node.key.argument : node.key.name

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
                  fixer.replaceText(classNode.value, `"${classNode.value.value} ${node.key.name}"`),
                  fixer.remove(node)
                ]
              } else {
                return fixer.replaceText(node, `class="${node.key.name}"`)
              }
            }
          })
        }
      }
    }

    return context.parserServices.defineTemplateBodyVisitor({
      'VElement[name="v-container"] > VStartTag > VAttribute': createVisitor('v-container'),
      'VElement[name="v-row"] > VStartTag > VAttribute': createVisitor('v-row'),
      'VElement[name="v-col"] > VStartTag > VAttribute': createVisitor('v-col')
    })
  }
}
