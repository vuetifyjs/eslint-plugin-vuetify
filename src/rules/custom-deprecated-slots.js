'use strict'

const { classify, isVueTemplate } = require('../util/helpers')

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of specified component slots, with optional replacements',
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
      removed: `do not use {{ component }}'s '{{ slot }}' slot (custom policy)`,
      replacedWith: `do not use {{ component }}'s '{{ slot }}' slot, use '{{ newSlot }}' instead`,
      removedWithMessage: `{{ component }}'s '{{ slot }}' slot {{ message }}`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    const options = context.options[0]
    if (!options || !Object.keys(options).length) return {}

    // Normalize keys to PascalCase
    const replacements = new Map()
    for (const [component, slots] of Object.entries(options)) {
      replacements.set(classify(component), slots)
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        if (node.name !== 'template' || node.parent.type !== 'VElement') return

        const tag = classify(node.parent.name)
        if (!replacements.has(tag)) return

        const slots = replacements.get(tag)

        const directive = node.startTag.attributes.find(attr => {
          return (
            attr.directive &&
            attr.key.name.name === 'slot' &&
            attr.key.argument?.name &&
            slots[attr.key.argument.name] !== undefined
          )
        })
        if (!directive) return

        const slotName = directive.key.argument.name
        const replace = slots[slotName]

        if (replace === false) {
          context.report({
            messageId: 'removed',
            data: {
              component: node.parent.name,
              slot: slotName,
            },
            node: directive,
          })
        } else if (typeof replace === 'string') {
          context.report({
            messageId: 'replacedWith',
            data: {
              component: node.parent.name,
              slot: slotName,
              newSlot: replace,
            },
            node: directive,
            fix (fixer) {
              return fixer.replaceText(directive.key.argument, replace)
            },
          })
        } else if (typeof replace === 'object' && replace !== null) {
          context.report({
            messageId: 'removedWithMessage',
            data: {
              component: node.parent.name,
              slot: slotName,
              message: replace.message,
            },
            node: directive,
          })
        }
      },
    })
  },
}
