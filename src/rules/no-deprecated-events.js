'use strict'

const { hyphenate, classify } = require('../util/helpers')

const model = {
  input: 'update:modelValue',
}

const inputs = {
  ...model,
  'click:appendOuter': 'click:append',
  'update:error': false,
}

const combobox = {
  ...inputs,
  'update:searchInput': 'update:search',
  'update:listIndex': false,
}

const replacements = {
  VTextField: inputs,
  VTextarea: inputs,
  VFileInput: inputs,
  VCombobox: {
    ...combobox,
    change: false,
  },
  VAutocomplete: {
    ...combobox,
    change: 'update:modelValue',
  },
  VSelect: {
    ...combobox,
    change: 'update:modelValue',
  },
  VAlert: model,
  VTabs: {
    ...model,
    'call:slider': false,
    change: 'update:modelValue',
    next: false,
    prev: false,
  },
  VTab: {
    change: 'group:selected',
  },
  VBottomNavigation: {
    change: 'update:modelValue',
    'update:inputValue': false,
  },
  VBtn: {
    change: 'group:selected',
  },
  VBtnToggle: {
    change: 'update:modelValue',
  },
  VCarousel: {
    change: 'update:modelValue',
  },
  VCheckbox: {
    change: 'update:modelValue',
    'update:error': false,
  },
  VChip: {
    ...model,
    'update:active': 'update:modelValue',
  },
  VChipGroup: {
    change: 'update:modelValue',
  },
  VColorPicker: {
    ...model,
    'update:color': 'update:modelValue',
  },
  VDialog: {
    ...model,
    'update:returnValue': false,
  },
  VExpansionPanels: {
    change: 'update:modelValue',
  },
  VExpansionPanel: {
    change: 'group:selected',
  },
  VForm: {
    input: 'update:modelValue',
  },
  VHover: model,
  VItemGroup: {
    change: 'update:modelValue',
  },
  VMenu: {
    ...model,
    'update:returnValue': false,
  },
  VNavigationDrawer: {
    ...model,
    'update:miniVariant': false,
  },
  VPagination: {
    ...model,
    previous: 'prev',
  },
  VProgressLinear: {
    change: 'update:modelValue',
  },
  VRadioGroup: {
    change: 'update:modelValue',
    'update:error': false,
  },
  VRadio: {
    change: 'update:modelValue',
    'update:error': false,
  },
  VRangeSlider: {
    ...model,
    change: false,
    'update:error': false,
  },
  VRating: model,
  VSlider: {
    ...model,
    change: false,
    'update:error': false,
  },
  VSlideGroup: {
    change: 'update:modelValue',
    next: false,
    prev: false,
  },
  VSnackbar: model,
  VSwitch: {
    change: 'update:modelValue',
    'update:error': false,
  },
  VWindow: {
    change: 'update:modelValue',
  },
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed and deprecated events.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `{{ tag }}: @{{ a }} has been replaced with @{{ b }}`,
      removed: `{{ tag }}: @{{ name }} has been removed`,
    },
  },

  create (context) {
    const sourceCode = context.sourceCode
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (!(attr.directive && attr.key.name.name === 'on' && attr.key.argument?.type === 'VIdentifier')) return

        const tag = classify(attr.parent.parent.rawName)
        if (!Object.keys(replacements).includes(tag)) return

        const eventNameNode = attr.key.argument
        const eventName = hyphenate(eventNameNode.rawName)

        Object.entries(replacements[tag]).forEach(([test, replace]) => {
          if (hyphenate(test) === eventName) {
            if (replace === false) {
              context.report({
                messageId: 'removed',
                data: { tag, name: eventName },
                node: eventNameNode,
              })
            } else if (typeof replace === 'string') {
              context.report({
                messageId: 'replacedWith',
                data: {
                  tag,
                  a: eventName,
                  b: replace,
                },
                node: eventNameNode,
                fix (fixer) {
                  return fixer.replaceText(eventNameNode, hyphenate(replace))
                },
              })
            } else if (typeof replace === 'object' && 'custom' in replace) {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: eventName,
                  b: replace.custom,
                },
                node: eventNameNode,
              })
            }
          }
        })
      },
    })
  },
}
