'use strict'

const { getInstalledVuetifyVersion } = require('../util/get-installed-vuetify-version')

// const spacers = {
//   0: 0,
//   1: 1,
//   2: 2,
//   3: 4,
//   4: 6,
//   5: 12
// }

/** @type {Map<RegExp, (args: string[]) => string> | Map<string, string>} */
const replacements = new Map([
  // ['shrink', 'flex-grow-0'],
  // ['grow', 'flex-shrink-0'],
  [/^text-xs-(left|right|center|justify)$/, ([align]) => `text-${align}`],
  // ['child-flex', false],
  ['scroll-y', 'overflow-y-auto'],
  ['hide-overflow', 'overflow-hidden'],
  ['show-overflow', 'overflow-visible'],
  ['no-wrap', 'text-no-wrap'],
  ['ellipsis', 'text-truncate'],
  ['left', 'float-left'],
  ['right', 'float-right'],
  // TODO: only run fixer once
  // [/([mp][axytblr])-(\d)/, (type, n) => `${type}-${spacers[n]}`]
])

if (getInstalledVuetifyVersion() >= '2.3.0') {
  replacements
    .set('display-4', 'text-h1')
    .set('display-3', 'text-h2')
    .set('display-2', 'text-h3')
    .set('display-1', 'text-h4')
    .set('headline', 'text-h5')
    .set('title', 'text-h6')
    .set('subtitle-1', 'text-subtitle-1')
    .set('subtitle-2', 'text-subtitle-2')
    .set('body-1', 'text-body-1')
    .set('body-2', 'text-body-2')
    .set('caption', 'text-caption')
    .set('overline', 'text-overline')
}

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
