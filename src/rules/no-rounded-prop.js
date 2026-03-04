'use strict'

const { isVueTemplate } = require('../util/helpers')
const { addClass, removeAttr } = require('../util/fixers')

const roundedMap = {
  '': 'rounded',
  0: 'rounded-none',
  sm: 'rounded-sm',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  circle: 'rounded-full',
  pill: 'rounded-full',
  shaped: 'rounded-te-xl rounded-bs-xl',
}

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the `rounded` prop; use Tailwind rounded utilities instead.',
      category: 'tailwindcss',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'rounded{{ valueDisplay }}' should be replaced with class="{{ className }}"`,
      noFix: `'rounded' prop should be replaced with a Tailwind rounded utility class`,
    },
  },
  create (context) {
    if (!isVueTemplate(context)) return {}

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (attr.directive && (attr.key.name.name !== 'bind' || !attr.key.argument)) return

        const propName = attr.directive
          ? attr.key.argument.rawName
          : attr.key.rawName

        if (propName !== 'rounded') return

        const element = attr.parent.parent
        const propNameNode = attr.directive ? attr.key.argument : attr.key

        // Boolean attribute (no value) — `rounded` with no `="..."`
        if (!attr.directive && !attr.value) {
          const className = roundedMap['']
          context.report({
            messageId: 'replacedWith',
            data: { valueDisplay: '', className },
            node: propNameNode,
            fix (fixer) {
              return [
                addClass(context, fixer, element, className),
                removeAttr(context, fixer, attr),
              ]
            },
          })
          return
        }

        // Get static value
        const value = attr.directive
          ? (attr.value?.expression?.type === 'Literal' ? String(attr.value.expression.value) : null)
          : attr.value?.value

        if (value != null && roundedMap[value] != null) {
          const className = roundedMap[value]
          context.report({
            messageId: 'replacedWith',
            data: { valueDisplay: `="${value}"`, className },
            node: propNameNode,
            fix (fixer) {
              return [
                addClass(context, fixer, element, className),
                removeAttr(context, fixer, attr),
              ]
            },
          })
        } else {
          context.report({
            messageId: 'noFix',
            node: propNameNode,
          })
        }
      },
    })
  },
}
