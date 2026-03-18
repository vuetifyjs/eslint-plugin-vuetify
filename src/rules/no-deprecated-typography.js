'use strict'

const { isVueTemplate } = require('../util/helpers')

const md2 = {
  'display-4': 'text-h1',
  'display-3': 'text-h2',
  'display-2': 'text-h3',
  'display-1': 'text-h4',
  headline: 'text-h5',
  title: 'text-h6',
  subheading: 'text-subtitle-1',
  'subtitle-1': 'text-subtitle-1',
  'subtitle-2': 'text-subtitle-2',
  'body-1': 'text-body-1',
  'body-2': 'text-body-2',
  caption: 'text-caption',
  overline: 'text-overline',
}

const md3 = {
  'text-h1': 'text-display-large',
  'text-h2': 'text-display-medium',
  'text-h3': 'text-display-small',
  'text-h4': 'text-headline-large',
  'text-h5': 'text-headline-medium',
  'text-h6': 'text-headline-small',
  'text-subtitle-1': 'text-body-large',
  'text-subtitle-2': 'text-label-large',
  'text-body-1': 'text-body-large',
  'text-body-2': 'text-body-medium',
  'text-caption': 'text-body-small',
  'text-button': 'text-label-large',
  'text-overline': 'text-label-small',
}

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const responsiveClassPattern = new RegExp(`^text-(${breakpoints.join('|')})-(.+)$`)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  md2,
  md3,
  meta: {
    docs: {
      description: 'Disallow deprecated MD2 typography classes, with configurable replacements.',
      category: 'recommended',
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
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' has been removed`,
    },
  },

  create (context) {
    if (!isVueTemplate(context)) return {}

    const replacements = { ...(context.options[0] || md3) }

    function getReplace (className) {
      const direct = replacements[className]
      if (direct === false) return null
      if (direct != null) return direct

      const match = responsiveClassPattern.exec(className)
      if (!match) return null

      const [, breakpoint, variant] = match
      const base = `text-${variant}`
      const baseReplace = replacements[base]
      if (baseReplace == null || baseReplace === false) return null

      const newVariant = baseReplace.startsWith('text-')
        ? baseReplace.slice(5)
        : baseReplace

      return `text-${breakpoint}-${newVariant}`
    }

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      'VAttribute[key.name="class"]' (node) {
        if (!node.value || !node.value.value) return

        const classes = node.value.value.split(/\s+/).filter(Boolean)

        classes.forEach(className => {
          const replace = getReplace(className)
          if (replace == null) return

          const idx = node.value.value.indexOf(className) + 1
          const range = [
            node.value.range[0] + idx,
            node.value.range[0] + idx + className.length,
          ]
          const loc = {
            start: context.sourceCode.getLocFromIndex(range[0]),
            end: context.sourceCode.getLocFromIndex(range[1]),
          }

          if (typeof replace === 'string') {
            context.report({
              loc,
              messageId: 'replacedWith',
              data: { a: className, b: replace },
              fix (fixer) {
                return fixer.replaceTextRange(range, replace)
              },
            })
          }
        })
      },
    })
  },
}
