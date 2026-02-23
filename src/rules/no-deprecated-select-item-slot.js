'use strict'

const { classify, isVueTemplate } = require('../util/helpers')

const components = ['VSelect', 'VAutocomplete', 'VCombobox']
const slots = ['item', 'selection']

// Properties that existed on the internal item object but not on raw data
const internalProps = ['title', 'value', 'props', 'children']

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Detect renamed item slot prop in VSelect, VAutocomplete, and VCombobox.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      internalAccess: `'{{ name }}.{{ prop }}' accesses an internal item property. In Vuetify 4, '{{ name }}' is the raw item. Use 'internalItem.{{ prop }}' instead.`,
      removeDotRaw: `'{{ name }}.raw' is redundant. In Vuetify 4, '{{ name }}' is already the raw item. Access '{{ name }}.{{ prop }}' directly.`,
      removeDotRawSimple: `'{{ name }}.raw' is redundant. In Vuetify 4, '{{ name }}' is already the raw item.`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        if (node.name !== 'template' || node.parent.type !== 'VElement') return
        if (
          !components.includes(classify(node.parent.name)) &&
          !components.includes(node.parent.name)
        ) return

        const directive = node.startTag.attributes.find(attr => {
          return (
            attr.directive &&
            attr.key.name.name === 'slot' &&
            slots.includes(attr.key.argument?.name)
          )
        })

        if (
          !directive ||
          !directive.value ||
          directive.value.type !== 'VExpressionContainer' ||
          !directive.value.expression
        ) return

        const param = directive.value.expression.params?.[0]
        if (!param) return

        // Find the "item" variable from destructuring or identifier
        let itemVariable
        if (param.type === 'ObjectPattern') {
          const itemProp = param.properties.find(p => p.key.name === 'item')
          if (!itemProp) return
          const localName = itemProp.value.name
          itemVariable = node.variables.find(v => v.id.name === localName)
        } else if (param.type === 'Identifier') {
          // #item="data" — user accesses data.item.X
          // This is harder to track, skip for now
          return
        }

        if (!itemVariable) return

        itemVariable.references.forEach(ref => {
          const member = ref.id.parent
          if (member.type !== 'MemberExpression') return

          const propName = member.property.name

          // item.raw.X → item.X
          if (propName === 'raw') {
            const outer = member.parent
            if (outer.type === 'MemberExpression' && outer.object === member) {
              const outerProp = outer.property.name
              context.report({
                messageId: 'removeDotRaw',
                data: { name: ref.id.name, prop: outerProp },
                node: member.property,
                fix (fixer) {
                  // Replace "item.raw.X" with "item.X"
                  return fixer.removeRange([member.property.range[0] - 1, member.property.range[1]])
                },
              })
            } else {
              context.report({
                messageId: 'removeDotRawSimple',
                data: { name: ref.id.name },
                node: member.property,
              })
            }
            return
          }

          // item.title, item.value, item.props, item.children → internalItem.X
          if (internalProps.includes(propName)) {
            context.report({
              messageId: 'internalAccess',
              data: { name: ref.id.name, prop: propName },
              node: member,
            })
          }
        })
      },
    })
  },
}
