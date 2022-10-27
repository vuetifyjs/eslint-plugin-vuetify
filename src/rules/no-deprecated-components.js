'use strict'

const { hyphenate, classify } = require('../util/helpers')
const { getInstalledVuetifyVersion } = require('../util/get-installed-vuetify-version')

const replacements = {
  VListTile: 'v-list-item',
  VListTileAction: 'v-list-item-action',
  VListTileAvatar: 'v-list-item-avatar',
  VListTileActionText: 'v-list-item-action-text',
  VListTileContent: 'v-list-item-content',
  VListTileTitle: 'v-list-item-title',
  VListTileSubTitle: 'v-list-item-subtitle',
  VJumbotron: false,
  VToolbarSideIcon: 'v-app-bar-nav-icon',

  // Possible typos
  VListItemSubTitle: 'v-list-item-subtitle',
  VListTileSubtitle: 'v-list-item-subtitle'
}

if (getInstalledVuetifyVersion() >= '2.3.0') {
  replacements.VContent = 'v-main'
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of components that have been removed from Vuetify',
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

        const tokens = context.parserServices.getTemplateBodyTokenStore()

        if (Object.prototype.hasOwnProperty.call(replacements, tag)) {
          const replacement = replacements[tag]
          if (replacement) {
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
          } else {
            context.report({
              node: element,
              messageId: 'removed',
              data: { name: hyphenate(tag) }
            })
          }
        }
      }
    })
  }
}
