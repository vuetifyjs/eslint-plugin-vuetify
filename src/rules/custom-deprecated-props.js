'use strict'

const { hyphenate, classify, isVueTemplate } = require('../util/helpers')

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of specified component props, with optional replacements',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              { type: 'string' },
              { type: 'boolean', enum: [false] },
              {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
                required: ['message'],
                additionalProperties: false,
              },
            ],
          },
        },
      },
    ],
    messages: {
      removed: `do not use '{{ name }}' (custom policy)`,
      replacedWith: `do not use '{{ a }}', use '{{ b }}' instead`,
      removedWithMessage: `'{{ name }}' {{ message }}`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    const options = context.options[0]
    if (!options || !Object.keys(options).length) return {}

    // Normalize keys to PascalCase
    const replacements = new Map()
    for (const [component, props] of Object.entries(options)) {
      const normalizedProps = {}
      for (const [prop, value] of Object.entries(props)) {
        normalizedProps[hyphenate(prop)] = value
      }
      replacements.set(classify(component), normalizedProps)
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (
          attr.directive &&
          (attr.key.name.name !== 'bind' || !attr.key.argument)
        ) return

        const tag = classify(attr.parent.parent.rawName)
        if (!replacements.has(tag)) return

        const propName = attr.directive
          ? hyphenate(attr.key.argument.rawName)
          : hyphenate(attr.key.rawName)

        const propNameNode = attr.directive
          ? attr.key.argument
          : attr.key

        const props = replacements.get(tag)
        const replace = props[propName]
        if (replace === undefined) return

        if (replace === false) {
          context.report({
            messageId: 'removed',
            data: { name: propName },
            node: propNameNode,
          })
        } else if (typeof replace === 'string') {
          context.report({
            messageId: 'replacedWith',
            data: {
              a: propName,
              b: replace,
            },
            node: propNameNode,
            fix (fixer) {
              return fixer.replaceText(propNameNode, replace)
            },
          })
        } else if (typeof replace === 'object' && replace !== null) {
          context.report({
            messageId: 'removedWithMessage',
            data: {
              name: propName,
              message: replace.message,
            },
            node: propNameNode,
          })
        }
      },
    })
  },
}
