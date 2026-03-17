'use strict'

const { isVueTemplate } = require('../util/helpers')

const defaultReplacements = {
  'd-flex': 'flex',
  'd-inline-flex': 'inline-flex',
  'd-block': 'block',
  'd-inline-block': 'inline-block',
  'd-inline': 'inline',
  'd-none': 'hidden',
  'd-grid': 'grid',
  'align-center': 'items-center',
  'align-start': 'items-start',
  'align-end': 'items-end',
  'align-baseline': 'items-baseline',
  'align-stretch': 'items-stretch',
  'justify-space-between': 'justify-between',
  'justify-space-around': 'justify-around',
  'justify-space-evenly': 'justify-evenly',
  'flex-grow-1': 'grow',
  'flex-grow-0': 'grow-0',
  'flex-shrink-1': 'shrink',
  'flex-shrink-0': 'shrink-0',
  'flex-column': 'flex-col',
  'font-weight-bold': 'font-bold',
  'font-weight-medium': 'font-medium',
  'font-weight-regular': 'font-normal',
  'font-weight-light': 'font-light',
  'font-weight-thin': 'font-thin',
  'text-truncate': 'truncate',
  'text-no-wrap': 'whitespace-nowrap',
  'fill-height': 'h-full',
  'w-100': 'w-full',
  'h-100': 'h-full',
}

// Generate spacing utility mappings only for prefixes that differ between Vuetify and Tailwind
// ma → m, pa → p (all other prefixes like mx, mt, px, pt etc. are already identical)
for (let i = 0; i <= 16; i++) {
  defaultReplacements[`ma-${i}`] = `m-${i}`
  defaultReplacements[`pa-${i}`] = `p-${i}`
}
defaultReplacements['ma-auto'] = 'm-auto'

// Negative margins: ma-n1..ma-n16 → -m-1..-m-16
for (let i = 1; i <= 16; i++) {
  defaultReplacements[`ma-n${i}`] = `-m-${i}`
}

module.exports = {
  defaultReplacements,
  meta: {
    docs: {
      description: 'Disallow Vuetify utility classes; use Tailwind equivalents instead.',
      category: 'tailwindcss',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      additionalProperties: {
        oneOf: [
          { type: 'string' },
          { type: 'boolean', enum: [false] },
        ],
      },
    }],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
    },
  },
  create (context) {
    if (!isVueTemplate(context)) return {}

    const replacements = { ...defaultReplacements, ...(context.options[0] || {}) }

    for (const key of Object.keys(replacements)) {
      if (replacements[key] === false) delete replacements[key]
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      'VAttribute[key.name="class"]' (node) {
        if (!node.value || !node.value.value) return

        const classes = node.value.value.split(/\s+/).filter(Boolean)

        classes.forEach(className => {
          // Support variant prefixes like md:pa-6, dark:flex-grow-1
          const parts = className.split(':')
          const baseClass = parts.pop()
          const prefix = parts.length ? parts.join(':') + ':' : ''

          const replace = replacements[baseClass]
          if (replace == null) return

          const fullReplace = prefix + replace
          const idx = node.value.value.indexOf(className) + 1
          const range = [
            node.value.range[0] + idx,
            node.value.range[0] + idx + className.length,
          ]
          const loc = {
            start: context.sourceCode.getLocFromIndex(range[0]),
            end: context.sourceCode.getLocFromIndex(range[1]),
          }

          context.report({
            loc,
            messageId: 'replacedWith',
            data: { a: className, b: fullReplace },
            fix (fixer) {
              return fixer.replaceTextRange(range, fullReplace)
            },
          })
        })
      },
    })
  },
}
