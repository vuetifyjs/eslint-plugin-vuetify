'use strict'

const { isVueTemplate } = require('../util/helpers')

/** @type {Map<RegExp, ((args: string[]) => string | false) | false> | Map<string, string | false>} */
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
  [/^text-xs-(left|right|center|justify)$/, ([align]) => `text-${align}`],
  [/^hidden-(xs|sm|md|lg|xl)-only$/, ([breakpoint]) => `hidden-${breakpoint}`],
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
  ['overline', 'text-overline'],
  [/^transition-(fast-out-slow-in|linear-out-slow-in|fast-out-linear-in|ease-in-out|fast-in-fast-out|swing)$/, false],
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
    if (!isVueTemplate(context)) return {}

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      'VAttribute[key.name="class"]' (node) {
        if (!node.value || !node.value.value) return

        const classes = node.value.value.split(/\s+/).filter(s => !!s)
        const changed = []
        classes.forEach(className => {
          for (const replacer of replacements) {
            if (typeof replacer[0] === 'string' && replacer[0] === className) {
              return changed.push([className, replacer[1]])
            }
            if (replacer[0] instanceof RegExp) {
              const matches = (replacer[0].exec(className) || []).slice(1)
              const replace = replacer[1]
              if (matches.length) {
                if (typeof replace === 'function') {
                  return changed.push([className, replace(matches)])
                } else {
                  return changed.push([className, replace])
                }
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
            start: context.sourceCode.getLocFromIndex(range[0]),
            end: context.sourceCode.getLocFromIndex(range[1]),
          }
          if (change[1]) {
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
          } else {
            context.report({
              loc,
              messageId: 'removed',
              data: {
                name: change[0],
              },
            })
          }
        })
      },
    })
  },
}
