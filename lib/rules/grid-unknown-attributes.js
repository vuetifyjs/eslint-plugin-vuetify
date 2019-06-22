'use strict'

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
      'VElement[name="v-row"] > VStartTag > VAttribute' (node) {
        if (node.directive && node.key.name !== 'bind') return

        const name = node.directive ? node.key.argument : node.key.name

        if (
          !['id', 'class', 'cols', 'justify', 'align'].includes(name) &&
          !name.startsWith('data')
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
    })
  }
}
