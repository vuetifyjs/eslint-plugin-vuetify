'use strict'

const { hyphenate, classify, getAttributes } = require('../util/helpers')

const replacements = {
  components: {
    VLayout: 'v-row',
    VFlex: 'v-col'
  },
  attrs: new Map([
    [/^align-self-(start|baseline|center|end)$/, ([align]) => `align-self="${align}"`],
    [/^(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `${bp === 'xs' ? 'cols' : bp}="${size}"`],
    [/^offset-(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `offset${bp === 'xs' ? '' : `-${bp}`}="${size}"`],
    [/^order-(xs|sm|md|lg|xl)(\d{1,2})$/, ([bp, size]) => `order${bp === 'xs' ? '' : `-${bp}`}="${size}"`],
    [/^align(-content)?-(start|baseline|center|end|space-around|space-between)$/, ([content, align]) => `align${content || ''}="${align}"`],
    [/^justify-(start|center|end|space-around|space-between)$/, ([align]) => `justify="${align}"`],
    [/^justify-between$/, () => 'justify="space-between"'],
    [/^(row)$/, () => ''],
    [/^(wrap)$/, () => ''],
    [/^(grid-list-)(xs|sm|md|lg|xl)$/, false],
    [/^(column)$/, false]
  ])
}

function isGridComponent (name) {
  return ['VContainer', 'VLayout', 'VFlex', 'VRow', 'VCol'].includes(name)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: '',
      category: 'recommended'
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

        if (!isGridComponent(tag)) return

        const tokens = context.parserServices.getTemplateBodyTokenStore()
        if (replacements.components.hasOwnProperty(tag)) {
          const replacement = replacements.components[tag]
          context.report({
            node: element,
            messageId: 'replacedWith',
            data: {
              a: hyphenate(tag),
              b: replacement
            },
            fix (fixer) {
              const open = tokens.getFirstToken(element.startTag)
              const endTag = element.endTag
              if (!endTag) {
                return fixer.replaceText(open, `<${replacement}`)
              }
              const endTagOpen = tokens.getFirstToken(endTag)
              return [
                fixer.replaceText(open, `<${replacement}`),
                fixer.replaceText(endTagOpen, `</${replacement}`)
              ]
            }
          })
        }

        getAttributes(element).forEach(attr => {
          for (const replacer of replacements.attrs) {
            const matches = (replacer[0].exec(attr.name) || []).slice(1)
            if (matches.length) {
              const replace = replacer[1]
              const replacement = typeof replace === 'function' && replace(matches)
              const message = !replacement
                ? { messageId: 'removed', data: { name: attr.name } }
                : {
                  messageId: 'replacedWith',
                  data: {
                    a: attr.name,
                    b: replacement
                  }
                }
              context.report(Object.assign({}, message, {
                node: attr.node,
                fix (fixer) {
                  if (replace === false) return
                  return fixer.replaceText(attr.node, replacement)
                }
              }))
            }
          }
        })
      }
    })
  }
}
