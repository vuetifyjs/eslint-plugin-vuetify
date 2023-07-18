'use strict'

const { hyphenate, classify } = require('../util/helpers')

const replacements = {
  VListTile: 'v-list-item',
  VListTileAction: 'v-list-item-action',
  VListTileAvatar: false,
  VListTileActionText: 'v-list-item-action-text',
  VListTileContent: false,
  VListTileTitle: 'v-list-item-title',
  VListTileSubTitle: 'v-list-item-subtitle',
  VJumbotron: false,
  VToolbarSideIcon: 'v-app-bar-nav-icon',

  // Possible typos
  VListItemSubTitle: 'v-list-item-subtitle',
  VListTileSubtitle: 'v-list-item-subtitle',

  VContent: 'v-main',

  VCalendar: false,
  VData: false,
  VListItemGroup: false,
  VListItemAvatar: false,
  VListItemContent: false,
  VListItemIcon: false,
  VOtpInput: false,
  VOverflowBtn: false,
  VPicker: false,
  VSimpleCheckbox: 'v-checkbox-btn',
  VSparkline: false,
  VSpeedDial: false,
  VStepper: false,
  VSubheader: { custom: 'v-list-subheader or class="text-subheader-2"' },
  VSimpleTable: 'v-table',
  VTimePicker: false,
  VTreeview: false,
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of components that have been removed from Vuetify',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      replacedWithCustom: `'{{ a }}' has been replaced with {{ b }}`,
      removed: `'{{ name }}' has been removed`,
    },
  },
  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VElement (element) {
        const tag = classify(element.rawName)

        const tokens = context.parserServices.getTemplateBodyTokenStore()

        if (Object.prototype.hasOwnProperty.call(replacements, tag)) {
          const replacement = replacements[tag]
          if (typeof replacement === 'object' && 'custom' in replacement) {
            context.report({
              node: element,
              messageId: 'replacedWithCustom',
              data: {
                a: hyphenate(tag),
                b: replacement.custom,
              },
            })
          } else if (typeof replacement === 'string') {
            context.report({
              node: element,
              messageId: 'replacedWith',
              data: {
                a: hyphenate(tag),
                b: replacement,
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
                  fixer.replaceText(endTagOpen, `</${replacement}`),
                ]
              },
            })
          } else if (!replacement) {
            context.report({
              node: element,
              messageId: 'removed',
              data: { name: hyphenate(tag) },
              fix (fixer) {
                if (tag === 'VListItemContent' && !element.startTag.attributes.length) {
                  return element.children.length
                    ? [fixer.remove(element.startTag), fixer.remove(element.endTag)]
                    : fixer.remove(element)
                }
              },
            })
          }
        }
      },
    })
  },
}
