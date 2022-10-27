'use strict'

const { hyphenate, classify, mergeDeep } = require('../util/helpers')
const { getInstalledVuetifyVersion } = require('../util/get-installed-vuetify-version')

const replacements = {
  VBtn: {
    outline: 'outlined',
    flat: 'text',
    round: 'rounded'
  },
  VAlert: {
    outline: 'outlined'
  },
  VBottomNavigation: {
    active: { custom: 'value or v-model' }
  },
  VCarousel: {
    hideControls: { custom: ':show-arrows="false"' }
  },
  VChip: {
    outline: 'outlined',
    selected: 'value'
  },
  VDataIterator: {
    expand: 'showExpand',
    contentClass: false,
    contentProps: false,
    contentTag: false,
    disableInitialSort: 'sortBy',
    filter: 'customFilter',
    pagination: 'options',
    totalItems: 'serverItemsLength',
    hideActions: 'hideDefaultFooter',
    rowsPerPageItems: { custom: 'footer-props.itemsPerPageOptions' },
    rowsPerPageText: { custom: 'footer-props.itemsPerPageText' },
    prevIcon: { custom: 'footer-props.prevIcon' },
    nextIcon: { custom: 'footer-props.nextIcon' }
  },
  VDataTable: {
    sortIcon: { custom: 'header-props.sortIcon' },
    hideHeaders: 'hideDefaultHeader',
    selectAll: 'showSelect'
  },
  VExpansionPanels: {
    expand: 'multiple'
  },
  VTextField: {
    box: 'filled',
    outline: 'outlined',
    mask: false
  },
  VTextarea: {
    box: 'filled',
    outline: 'outlined',
    mask: false
  },
  VSelect: {
    box: 'filled',
    combobox: { custom: '<v-combobox />' },
    outline: 'outlined'
  },
  VAutocomplete: {
    box: 'filled',
    outline: 'outlined'
  },
  VCombobox: {
    box: 'filled',
    outline: 'outlined'
  },
  VListItem: {
    avatar: false
  },
  VToolbar: {
    app: { custom: '<v-app-bar app />' },
    manualScroll: { custom: '<v-app-bar :value="false" />' },
    clippedLeft: { custom: '<v-app-bar clipped-left />' },
    clippedRight: { custom: '<v-app-bar clipped-right />' },
    invertedScroll: { custom: '<v-app-bar inverted-scroll />' },
    scrollOffScreen: { custom: '<v-app-bar scroll-off-screen />' },
    scrollTarget: { custom: '<v-app-bar scroll-target />' },
    scrollThreshold: { custom: '<v-app-bar scroll-threshold />' },
    card: 'flat'
  },
  VSnackbar: {
    autoHeight: false
  }
}

if (getInstalledVuetifyVersion() >= '2.3.0') {
  mergeDeep(replacements, {
    VBanner: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    VDataIterator: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    VNavigationDrawer: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    VSlideGroup: {
      mobileBreakPoint: 'mobileBreakpoint'
    },
    VTabs: {
      mobileBreakPoint: 'mobileBreakpoint'
    }
  })
}

mergeDeep(replacements.VDataTable, replacements.VDataIterator)

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed and deprecated props.',
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
      VAttribute (attr) {
        if (
          attr.directive &&
          (attr.key.name.name !== 'bind' || !attr.key.argument)
        ) return

        const tag = classify(attr.parent.parent.rawName)
        if (!Object.keys(replacements).includes(tag)) return

        const propName = attr.directive
          ? hyphenate(attr.key.argument.rawName)
          : hyphenate(attr.key.rawName)

        const propNameNode = attr.directive
          ? attr.key.argument
          : attr

        Object.entries(replacements[tag]).forEach(([test, replace]) => {
          if (hyphenate(test) === propName) {
            if (replace === false) {
              context.report({
                messageId: 'removed',
                data: { name: propName },
                node: propNameNode
              })
            } else if (typeof replace === 'string') {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace
                },
                node: propNameNode,
                fix (fixer) {
                  return fixer.replaceText(propNameNode, replace)
                }
              })
            } else if (typeof replace === 'object' && Object.hasOwnProperty.call(replace, 'custom')) {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace.custom
                },
                node: propNameNode
              })
            }
          }
        })
      }
    })
  }
}
