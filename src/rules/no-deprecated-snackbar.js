'use strict'

const { hyphenate, classify, isVueTemplate } = require('../util/helpers')

// VSnackbarQueue: #default slot was renamed to #item in Vuetify 4
const slotRenames = [
  { component: 'VSnackbarQueue', from: 'default', to: 'item' },
]

// VSnackbar props deprecated in Vuetify 4
const propReplacements = {
  VSnackbar: {
    multiLine: { name: 'min-height', value: '68' },
  },
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow deprecated props and slots on Vuetify snackbar components.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      renamed: `{{ component }}'s '{{ slot }}' slot has been renamed to '{{ newSlot }}'`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (
          attr.directive &&
          (attr.key.name.name !== 'bind' || !attr.key.argument)
        ) return

        const tag = classify(attr.parent.parent.rawName)
        if (!Object.keys(propReplacements).includes(tag)) return

        const propName = attr.directive
          ? hyphenate(attr.key.argument.rawName)
          : hyphenate(attr.key.rawName)

        const propNameNode = attr.directive ? attr.key.argument : attr.key

        Object.entries(propReplacements[tag]).forEach(([test, replace]) => {
          if (hyphenate(test) !== propName) return

          const oldValue = attr.directive
            ? context.sourceCode.getText(attr.value.expression)
            : attr.value?.value
          const value = typeof replace.value === 'function'
            ? replace.value(oldValue)
            : replace.value

          if (value == null || value === oldValue) return

          context.report({
            messageId: 'replacedWith',
            data: {
              a: propName,
              b: `${replace.name}="${value}"`,
            },
            node: propNameNode,
            fix (fixer) {
              if (attr.directive && replace.bind !== false) {
                if (replace.bind) {
                  return [fixer.replaceText(propNameNode, replace.name), fixer.replaceText(attr.value, `"${value}"`)]
                } else {
                  const expression = context.sourceCode.getText(attr.value.expression)
                  return [fixer.replaceText(propNameNode, replace.name), fixer.replaceText(attr.value, `"${expression} ? '${value}' : undefined"`)]
                }
              } else {
                return fixer.replaceText(attr, `${replace.bind ? ':' : ''}${replace.name}="${value}"`)
              }
            },
          })
        })
      },

      VElement (node) {
        if (node.name !== 'template' || node.parent.type !== 'VElement') return

        const parentName = classify(node.parent.name)

        for (const { component, from, to } of slotRenames) {
          if (parentName !== component) continue

          const directive = node.startTag.attributes.find(attr => {
            return (
              attr.directive &&
              attr.key.name.name === 'slot' &&
              attr.key.argument?.name === from
            )
          })
          if (!directive) continue

          context.report({
            node: directive,
            messageId: 'renamed',
            data: {
              component: node.parent.name,
              slot: from,
              newSlot: to,
            },
            fix (fixer) {
              return fixer.replaceText(directive.key.argument, to)
            },
          })
        }
      },
    })
  },
}
