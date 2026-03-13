'use strict'

const { hyphenate, classify, isVueTemplate } = require('../util/helpers')

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of specified component events, with optional replacements',
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
      removed: `{{ tag }}: do not use @{{ name }} (custom policy)`,
      replacedWith: `{{ tag }}: do not use @{{ a }}, use @{{ b }} instead`,
      removedWithMessage: `{{ tag }}: @{{ name }} {{ message }}`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    const options = context.options[0]
    if (!options || !Object.keys(options).length) return {}

    // Normalize keys to PascalCase
    const replacements = new Map()
    for (const [component, events] of Object.entries(options)) {
      const normalizedEvents = {}
      for (const [event, value] of Object.entries(events)) {
        normalizedEvents[hyphenate(event)] = value
      }
      replacements.set(classify(component), normalizedEvents)
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (!(attr.directive && attr.key.name.name === 'on' && attr.key.argument?.type === 'VIdentifier')) return

        const tag = classify(attr.parent.parent.rawName)
        if (!replacements.has(tag)) return

        const eventNameNode = attr.key.argument
        const eventName = hyphenate(eventNameNode.rawName)

        const events = replacements.get(tag)
        const replace = events[eventName]
        if (replace === undefined) return

        if (replace === false) {
          context.report({
            messageId: 'removed',
            data: { tag, name: eventName },
            node: eventNameNode,
          })
        } else if (typeof replace === 'string') {
          context.report({
            messageId: 'replacedWith',
            data: {
              tag,
              a: eventName,
              b: replace,
            },
            node: eventNameNode,
            fix (fixer) {
              return fixer.replaceText(eventNameNode, hyphenate(replace))
            },
          })
        } else if (typeof replace === 'object' && replace !== null) {
          context.report({
            messageId: 'removedWithMessage',
            data: {
              tag,
              name: eventName,
              message: replace.message,
            },
            node: eventNameNode,
          })
        }
      },
    })
  },
}
