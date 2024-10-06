'use strict'

const cssColors = [
  'red', 'pink', 'purple', 'deep-purple',
  'indigo', 'blue', 'light-blue', 'cyan',
  'teal', 'green', 'light-green', 'lime',
  'yellow', 'amber', 'orange', 'deep-orange',
  'brown', 'blue-grey', 'grey', 'black',
  'white', 'transparent',
]
const cssTextColors = cssColors.map(v => `${v}--text`)
const variants = [
  'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5',
  'darken-1', 'darken-2', 'darken-3', 'darken-4',
  'accent-1', 'accent-2', 'accent-3', 'accent-4',
]
const textVariants = variants.map(v => `text--${v}`)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the use of classes that have been removed from Vuetify',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        themeColors: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      additionalProperties: false,
    }],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' cannot be used alone, it must be combined with a color`,
    },
  },

  create (context) {
    const themeColors = ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success', ...(context.options[0]?.themeColors || [])]
    const themeTextColors = themeColors.map(v => `${v}--text`)

    function findColor (classes) {
      const base = classes.findIndex(t => themeColors.includes(t) || cssColors.includes(t))
      const variant = classes.findIndex(t => variants.includes(t))

      return [base, variant]
    }
    function findTextColor (classes) {
      const base = classes.findIndex(t => themeTextColors.includes(t) || cssTextColors.includes(t))
      const variant = classes.findIndex(t => textVariants.includes(t))

      return [base, variant]
    }

    const sourceCode = context.sourceCode
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      'VAttribute[key.name="color"]' (node) {
        if (!node.value || !node.value.value) return

        const color = node.value.value.split(/\s+/).filter(s => !!s)
        const [base, variant] = findColor(color)
        if (~base && ~variant) {
          context.report({
            node,
            messageId: 'replacedWith',
            data: {
              a: node.value.value,
              b: `${color[base]}-${color[variant]}`,
            },
            fix: fixer => fixer.replaceTextRange(node.value.range, `"${color[base]}-${color[variant]}"`),
          })
        }
      },
      'VAttribute[key.name="class"]' (node) {
        if (!node.value || !node.value.value) return

        const classes = node.value.value.split(/\s+/).filter(s => !!s)

        for (const [find, prefix] of [[findColor, 'bg'], [findTextColor, 'text']]) {
          const [base, variant] = find(classes)
          if (~base || (~base && ~variant)) {
            const newColor = ~variant
              ? `${prefix}-${classes[base].replace('--text', '')}-${classes[variant].replace('text--', '')}`
              : `${prefix}-${classes[base].replace('--text', '')}`

            context.report({
              node,
              messageId: 'replacedWith',
              data: {
                a: ~variant ? `${classes[base]} ${classes[variant]}` : classes[base],
                b: newColor,
              },
              fix: fixer => {
                const newClasses = classes.slice()
                newClasses.splice(base, 1, newColor)
                if (~variant) newClasses.splice(variant, 1)

                return fixer.replaceTextRange(node.value.range, `"${newClasses.join(' ')}"`)
              },
            })
          } else if (~variant) {
            context.report({
              node,
              messageId: 'removed',
              data: {
                name: classes[variant],
              },
            })
          }
        }
      },
    })
  },
}
