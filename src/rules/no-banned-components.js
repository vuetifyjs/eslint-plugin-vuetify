'use strict'

const { classify, hyphenate, isVueTemplate } = require('../util/helpers')

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of specified components, with optional replacements',
      category: 'experimental',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          oneOf: [
            { type: 'string' },
            { type: 'boolean', enum: [false] },
          ],
        },
      },
    ],
    messages: {
      banned: `'{{ name }}' is banned`,
      bannedWithReplacement: `'{{ name }}' is banned, use '{{ replacement }}' instead`,
    },
  },
  create (context) {
    if (!isVueTemplate(context)) return {}

    const options = context.options[0]
    if (!options || !Object.keys(options).length) return {}

    // Normalize keys to PascalCase for lookup
    const banned = new Map()
    for (const [key, value] of Object.entries(options)) {
      banned.set(classify(key), value)
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)
        if (!banned.has(tag)) return

        const replacement = banned.get(tag)
        const tokens = context.sourceCode.parserServices.getTemplateBodyTokenStore()

        if (typeof replacement === 'string') {
          // Parse replacement: tag part and optional classes (dot-separated)
          const parts = replacement.split('.')
          const replacementTag = parts[0]
          const classes = parts.slice(1)

          context.report({
            node: element,
            messageId: 'bannedWithReplacement',
            data: {
              name: hyphenate(tag),
              replacement,
            },
            fix (fixer) {
              const fixes = []
              const open = tokens.getFirstToken(element.startTag)
              fixes.push(fixer.replaceText(open, `<${replacementTag}`))

              if (element.endTag) {
                const endTagOpen = tokens.getFirstToken(element.endTag)
                fixes.push(fixer.replaceText(endTagOpen, `</${replacementTag}`))
              }

              if (classes.length) {
                const classValue = classes.join(' ')
                const classAttr = element.startTag.attributes.find(attr =>
                  !attr.directive && attr.key.rawName === 'class'
                )
                if (classAttr && classAttr.value) {
                  const existing = classAttr.value.value
                  fixes.push(fixer.replaceText(classAttr.value, `"${existing} ${classValue}"`))
                } else if (!classAttr) {
                  fixes.push(fixer.insertTextAfter(open, ` class="${classValue}"`))
                }
              }

              return fixes
            },
          })
        } else {
          context.report({
            node: element,
            messageId: 'banned',
            data: { name: hyphenate(tag) },
          })
        }
      },
    })
  },
}
