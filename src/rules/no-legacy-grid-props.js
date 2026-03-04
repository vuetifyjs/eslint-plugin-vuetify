'use strict'

const { hyphenate, classify, isVueTemplate } = require('../util/helpers')
const { addClass, removeAttr } = require('../util/fixers')

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl']

// VRow props that should become utility classes
const rowPropToClass = {
  align: value => `align-${value}`,
  justify: value => `justify-${value}`,
  'align-content': value => `align-content-${value}`,
}

// Generate responsive variants: align-sm, align-md, justify-sm, etc.
for (const [prop, fn] of Object.entries({ ...rowPropToClass })) {
  for (const bp of breakpoints) {
    rowPropToClass[`${prop}-${bp}`] = value => `${fn(value).replace(value, '')}-${bp}-${value}`
  }
}
// Fix responsive class generation — the base fn closures captured value incorrectly, redo properly
for (const bp of breakpoints) {
  rowPropToClass[`align-${bp}`] = value => `align-${bp}-${value}`
  rowPropToClass[`justify-${bp}`] = value => `justify-${bp}-${value}`
  rowPropToClass[`align-content-${bp}`] = value => `align-content-${bp}-${value}`
}

// VCol props that should become utility classes
const colPropToClass = {
  order: value => `order-${value}`,
  'align-self': value => `align-self-${value}`,
}

for (const bp of breakpoints) {
  colPropToClass[`order-${bp}`] = value => `order-${bp}-${value}`
}

const replacements = {
  VRow: {
    props: rowPropToClass,
    renamed: {
      dense: { name: 'density', value: 'compact' },
    },
  },
  VCol: {
    props: colPropToClass,
    renamed: {},
  },
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed grid props.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      movedToClass: `'{{ prop }}' has been removed, use class="{{ className }}" instead`,
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
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
        const config = replacements[tag]
        if (!config) return

        const propName = attr.directive
          ? hyphenate(attr.key.argument.rawName)
          : hyphenate(attr.key.rawName)

        const propNameNode = attr.directive
          ? attr.key.argument
          : attr.key

        const element = attr.parent.parent

        // Check for props that should become utility classes
        if (config.props[propName]) {
          const toClass = config.props[propName]

          // Need a static value to auto-fix
          const value = attr.directive
            ? (attr.value?.expression?.type === 'Literal' ? String(attr.value.expression.value) : null)
            : attr.value?.value

          if (value) {
            const className = toClass(value)
            context.report({
              messageId: 'movedToClass',
              data: { prop: propName, className },
              node: propNameNode,
              fix (fixer) {
                return [
                  addClass(context, fixer, element, className),
                  removeAttr(context, fixer, attr),
                ]
              },
            })
          } else {
            // Dynamic value — can't auto-fix but still report
            const className = toClass('<value>')
            context.report({
              messageId: 'movedToClass',
              data: { prop: propName, className },
              node: propNameNode,
            })
          }
          return
        }

        // Check for renamed props (e.g. dense -> density="compact")
        const renamed = config.renamed[propName]
        if (renamed) {
          context.report({
            messageId: 'replacedWith',
            data: {
              a: propName,
              b: `${renamed.name}="${renamed.value}"`,
            },
            node: propNameNode,
            fix (fixer) {
              return fixer.replaceText(attr, `${renamed.name}="${renamed.value}"`)
            },
          })
        }
      },
    })
  },
}
