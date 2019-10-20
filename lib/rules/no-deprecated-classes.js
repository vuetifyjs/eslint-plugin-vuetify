'use strict'

const { classify, getAttributes } = require('../util/helpers')

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
  ['right', 'float-right']
  // TODO: only run fixer once
  // [/([mp][axytblr])-(\d)/, (type, n) => `${type}-${spacers[n]}`]
])

// These components treat attributes like classes
const gridComponents = ['VContainer', 'VLayout', 'VFlex', 'VSpacer']

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the use of classes that have been removed from Vuetify'
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' has been removed`
    }
  },

  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)

        if (!gridComponents.includes(tag)) return

        getAttributes(element).forEach(attr => {
          for (const replacer of replacements) {
            if (typeof replacer[0] === 'string' && replacer[0] === attr.name) {
              const replacement = replacer[1]
              return context.report({
                messageId: 'replacedWith',
                data: {
                  a: attr.name,
                  b: replacement
                },
                node: attr.node,
                fix (fixer) {
                  return fixer.replaceText(attr.node, replacement)
                }
              })
            }
            if (replacer[0] instanceof RegExp) {
              const matches = (replacer[0].exec(attr.name) || []).slice(1)
              const replace = replacer[1]
              if (matches.length && typeof replace === 'function') {
                const replacement = replace(matches)
                return context.report({
                  messageId: 'replacedWith',
                  data: {
                    a: attr.name,
                    b: replacement
                  },
                  node: attr.node,
                  fix (fixer) {
                    return fixer.replaceText(attr.node, replacement)
                  }
                })
              }
            }
          }

          // Remove <v-layout row> as it conflicts with <v-row> styles
          // https://github.com/vuetifyjs/vuetify/commit/3f435b5a
          if (tag === 'VLayout' && attr.name === 'row') {
            return context.report({
              node: attr.node,
              message: `Don't use "row" on <v-layout>, see https://github.com/vuetifyjs/vuetify/commit/3f435b5a`,
              fix (fixer) {
                if (attr.node.directive) return

                const source = context.getSourceCode().text
                let [start, end] = attr.node.range
                // Also remove whitespace after attributes
                if (/\s/.test(source[end])) ++end
                return fixer.removeRange([start, end])
              }
            })
          }
        })
      },
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
            node.value.range[0] + idx + change[0].length
          ]
          const loc = {
            start: source.getLocFromIndex(range[0]),
            end: source.getLocFromIndex(range[1])
          }
          context.report({
            loc,
            messageId: 'replacedWith',
            data: {
              a: change[0],
              b: change[1]
            },
            fix (fixer) {
              return fixer.replaceTextRange(range, change[1])
            }
          })
        })
      }
    })
  }
}
