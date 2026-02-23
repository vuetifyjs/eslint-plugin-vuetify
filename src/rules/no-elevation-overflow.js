'use strict'

const { isVueTemplate } = require('../util/helpers')

const MAX_ELEVATION = 5

// Match elevation-N in a class string, return the number
const elevationRegex = /\belevation-(\d+)\b/g

function checkClassValue (context, node, value) {
  let match
  elevationRegex.lastIndex = 0
  while ((match = elevationRegex.exec(value)) !== null) {
    const level = parseInt(match[1], 10)
    if (level > MAX_ELEVATION) {
      context.report({
        messageId: 'overflow',
        data: { level: String(level), max: String(MAX_ELEVATION) },
        node,
      })
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow elevation classes above the MD3 maximum (0–5).',
      category: 'recommended',
    },
    fixable: null,
    schema: [],
    messages: {
      overflow: 'Elevation level {{ level }} exceeds the MD3 maximum of {{ max }}.',
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        // Static class="elevation-10"
        if (
          !attr.directive &&
          attr.key.rawName === 'class' &&
          attr.value
        ) {
          checkClassValue(context, attr, attr.value.value)
          return
        }

        // :class="'elevation-10'" or :class="`elevation-${n}`" — check literal strings
        if (
          attr.directive &&
          attr.key.name.name === 'bind' &&
          attr.key.argument?.rawName === 'class' &&
          attr.value?.expression?.type === 'Literal' &&
          typeof attr.value.expression.value === 'string'
        ) {
          checkClassValue(context, attr, attr.value.expression.value)
          return
        }

        // :elevation="10" or elevation="10" on any component
        const propName = attr.directive
          ? attr.key.argument?.rawName
          : attr.key.rawName

        if (propName !== 'elevation') return

        const value = attr.directive
          ? (attr.value?.expression?.type === 'Literal' ? attr.value.expression.value : null)
          : (attr.value ? Number(attr.value.value) : null)

        if (typeof value === 'number' && value > MAX_ELEVATION) {
          context.report({
            messageId: 'overflow',
            data: { level: String(value), max: String(MAX_ELEVATION) },
            node: attr,
          })
        }
      },
    })
  },
}
