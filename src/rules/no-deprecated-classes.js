'use strict'

/** @type {Map<RegExp, (args: string[]) => string> | Map<string, string>} */
const replacements = new Map([
  [/^rounded-(r|l|tr|tl|br|bl)(-.*)?$/, ([side, rest]) => {
    side = {
      r: 'e',
      l: 's',
      tr: 'te',
      tl: 'ts',
      br: 'be',
      bl: 'bs',
    }[side]
    return `rounded-${side}${rest || ''}`
  }],
  [/^border-([rl])(.*)$/, ([side, rest]) => {
    side = {
      r: 'e',
      l: 's',
    }[side]
    return `border-${side}${rest}`
  }],
  [/^text-xs-(left|right|center|justify)$/, ([align]) => `text-${align}`],
  ['scroll-y', 'overflow-y-auto'],
  ['hide-overflow', 'overflow-hidden'],
  ['show-overflow', 'overflow-visible'],
  ['no-wrap', 'text-no-wrap'],
  ['ellipsis', 'text-truncate'],
  ['left', 'float-left'],
  ['right', 'float-right'],
  ['display-4', 'text-h1'],
  ['display-3', 'text-h2'],
  ['display-2', 'text-h3'],
  ['display-1', 'text-h4'],
  ['headline', 'text-h5'],
  ['title', 'text-h6'],
  ['subtitle-1', 'text-subtitle-1'],
  ['subtitle-2', 'text-subtitle-2'],
  ['body-1', 'text-body-1'],
  ['body-2', 'text-body-2'],
  ['caption', 'text-caption'],
  ['caption', 'text-caption'],
  ['overline', 'text-overline'],
])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the use of classes that have been removed from Vuetify',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' has been removed`,
    },
  },

  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      'VAttribute[key.name="class"]' (node) {
        if (!node.value || !node.value.value) return

        const classes = node.value.value.split(/\s+/).filter(s => !!s)
        const source = context.getSourceCode()

        const changed = []
        classes.forEach(className => {
          for (const replacer of replacements) {
            if (typeof replacer[0] === 'string' && replacer[0] === className) {
              return changed.push([className, replacer[1]])
            }
            if (replacer[0] instanceof RegExp) {
              const matches = (replacer[0].exec(className) || []).slice(1)
              const replace = replacer[1]
              if (matches.length && typeof replace === 'function') {
                return changed.push([className, replace(matches)])
              }
            }
          }
        })

        changed.forEach(change => {
          const idx = node.value.value.indexOf(change[0]) + 1
          const range = [
            node.value.range[0] + idx,
            node.value.range[0] + idx + change[0].length,
          ]
          const loc = {
            start: source.getLocFromIndex(range[0]),
            end: source.getLocFromIndex(range[1]),
          }
          context.report({
            loc,
            messageId: 'replacedWith',
            data: {
              a: change[0],
              b: change[1],
            },
            fix (fixer) {
              return fixer.replaceTextRange(range, change[1])
            },
          })
        })
      },
    })
  },
}
