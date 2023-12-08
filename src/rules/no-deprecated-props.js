'use strict'

const { hyphenate, classify } = require('../util/helpers')

const size = {
  maxHeight: false,
  maxWidth: false,
  minHeight: false,
  minWidth: false,
}

const sizes = {
  large: { name: 'size', value: 'large' },
  medium: { name: 'size', value: 'medium' },
  small: { name: 'size', value: 'small' },
  xLarge: { name: 'size', value: 'x-large' },
  xSmall: { name: 'size', value: 'x-small' },
}

const theme = {
  dark: false,
  light: false,
}

const inputs = {
  appendOuterIcon: 'append-icon',
  backgroundColor: 'bg-color',
  box: { name: 'variant', value: 'filled' },
  dense: { name: 'density', value: 'compact' },
  errorCount: 'max-errors',
  filled: { name: 'variant', value: 'filled' },
  fullWidth: false,
  height: false,
  hideSpinButtons: false,
  loaderHeight: false,
  outline: { name: 'variant', value: 'outlined' },
  outlined: { name: 'variant', value: 'outlined' },
  shaped: false,
  solo: { name: 'variant', value: 'solo' },
  soloInverted: { name: 'variant', value: 'solo-inverted' },
  success: false,
  successMessages: false,
  validateOnBlur: { name: 'validate-on', value: 'blur' },
  value: 'model-value',
  ...theme,
}

const select = {
  allowOverflow: false,
  attach: { custom: ':menu-props="{ attach: true }"' },
  cacheItems: false,
  deletableChips: 'closable-chips',
  disableLookup: false,
  itemColor: { custom: 'item-props.color' },
  itemDisabled: { custom: 'item-props.disabled' },
  itemText: 'item-title',
  searchInput: 'search',
  smallChips: false,
  filter: 'customFilter',
  ...inputs,
  dense: false,
}

const link = {
  append: false,
  exactActiveClass: false,
  exactPath: false,
  nuxt: false,
}

const overlay = {
  hideOverlay: { name: 'scrim', bind: true, value: false },
  internalActivator: false,
  overlayColor: 'scrim',
  overlayOpacity: false,
  value: 'model-value',
  returnValue: false,
}

const replacements = {
  VAppBar: {
    app: false,
    clippedLeft: false,
    clippedRight: false,
    collapseOnScroll: false,
    elevateOnScroll: false,
    fadeImgOnScroll: false,
    fixed: false,
    hideOnScroll: false,
    invertedScroll: false,
    outlined: 'border',
    prominent: false,
    scrollOffScreen: false,
    scrollTarget: false,
    scrollThreshold: false,
    shaped: false,
    short: false,
    shrinkOnScroll: false,
    tile: false,
    width: false,
    ...theme,
    ...size,
  },
  VAlert: {
    border: { name: 'border', value: value => ({ right: 'end', left: 'start' }[value] || value) },
    dense: { name: 'density', value: 'compact' },
    outline: { name: 'variant', value: 'outlined' },
    coloredBorder: { custom: 'border-color' },
    dismissible: 'closable',
    mode: false,
    origin: false,
    outlined: { name: 'variant', value: 'outlined' },
    shaped: false,
    tile: { name: 'rounded', value: 0 },
    transition: false,
    ...theme,
  },
  VAvatar: {
    height: { custom: 'size' },
    width: { custom: 'size' },
    left: 'start',
    right: 'end',
    ...size,
  },
  VBadge: {
    avatar: false,
    mode: false,
    origin: false,
    overlap: false,
    bottom: { name: 'location', value: 'bottom' },
    left: { name: 'location', value: 'left' },
    right: { name: 'location', value: 'right' },
    top: { name: 'location', value: 'top' },
  },
  VBanner: {
    app: false,
    iconColor: false,
    mobileBreakPoint: false,
    outlined: false,
    shaped: false,
    value: false,
  },
  VBottomNavigation: {
    activeClass: 'selected-class',
    app: false,
    fixed: false,
    hideOnScroll: false,
    inputValue: false,
    scrollTarget: false,
    scrollThreshold: false,
    width: false,
    value: 'model-value',
    ...size,
  },
  VBreadcrumbs: {
    large: false,
    ...theme,
  },
  VBreadcrumbsItem: {
    link: false,
    ripple: false,
    ...link,
  },
  VBtn: {
    activeClass: 'selected-class',
    bottom: { name: 'location', value: 'bottom' },
    depressed: { name: 'variant', value: 'flat' },
    fab: false,
    flat: { name: 'variant', value: 'flat' },
    inputValue: false,
    left: { name: 'location', value: 'left' },
    link: false,
    outline: { name: 'variant', value: 'outlined' },
    outlined: { name: 'variant', value: 'outlined' },
    plain: { name: 'variant', value: 'plain' },
    retainFocusOnClick: false,
    right: { name: 'location', value: 'right' },
    round: 'rounded',
    shaped: false,
    text: { name: 'variant', value: 'text' },
    tile: false,
    top: { name: 'location', value: 'top' },
    ...link,
    ...theme,
    ...sizes,
  },
  VBtnToggle: {
    activeClass: 'selected-class',
    backgroundColor: false,
    borderless: false,
    dense: { name: 'density', value: 'compact' },
    shaped: false,
    tile: { name: 'rounded', value: 0 },
    value: 'model-value',
    valueComparator: false,
    ...theme,
  },
  VCard: {
    activeClass: false,
    loaderHeight: false,
    outlined: { name: 'variant', value: 'outlined' },
    raised: { name: 'elevation', value: 8 },
    shaped: false,
    tile: { name: 'rounded', value: 0 },
    ...link,
  },
  VCarousel: {
    activeClass: 'selected-class',
    max: false,
    multiple: false,
    progressColor: { custom: 'progress="<color>"' },
    showArrowsOnHover: { name: 'show-arrows', value: 'hover' },
    touchless: false,
    valueComparator: false,
    vertical: { name: 'direction', value: 'vertical' },
    value: 'model-value',
    ...theme,
  },
  VCarouselItem: {
    activeClass: 'selected-class',
    exact: false,
    href: false,
    link: false,
    replace: false,
    ripple: false,
    target: false,
    to: false,
    ...link,
  },
  VCheckbox: {
    backgroundColor: false,
    dense: false,
    errorCount: 'max-errors',
    hideSpinButtons: false,
    inputValue: 'model-value',
    offIcon: 'false-icon',
    onIcon: 'true-icon',
    offValue: 'false-value',
    onValue: 'true-value',
    success: false,
    successMessages: false,
    validateOnBlur: { name: 'validate-on', value: 'blur' },
  },
  VChip: {
    active: false,
    close: 'closable',
    inputValue: 'model-value',
    outline: { name: 'variant', value: 'outlined' },
    outlined: { name: 'variant', value: 'outlined' },
    selected: 'value',
    textColor: false,
    ...link,
    ...sizes,
    ...theme,
  },
  VChipGroup: {
    activeClass: 'selected-class',
    centerActive: false,
    mobileBreakPoint: false,
    nextIcon: false,
    prevIcon: false,
    showArrows: false,
    value: 'model-value',
  },
  VColorPicker: {
    flat: false,
    hideModeSwitch: false,
    value: 'model-value',
  },
  VDataTable: {
    serverItemsLength: { custom: '<v-data-table-server>' },
    itemClass: { custom: 'row-props' },
    itemStyle: { custom: 'row-props' },
    sortDesc: { custom: 'sort-by' },
    groupDesc: { custom: 'group-by' },
  },
  VDatePicker: {
    activePicker: 'view-mode',
    pickerDate: { custom: 'separate month and year props' },
    locale: false,
    localeFirstDayOfYear: false,
    firstDayOfWeek: false,
    dayFormat: false,
    weekdayFormat: false,
    monthFormat: false,
    yearFormat: false,
    headerDateFormat: false,
    titleDateFormat: false,
    range: false,
  },
  VExpansionPanels: {
    accordion: { name: 'variant', value: 'accordion' },
    inset: { name: 'variant', value: 'inset' },
    popout: { name: 'variant', value: 'popout' },
    activeClass: 'selected-class',
    flat: false,
    focusable: false,
    hover: false,
    tile: false,
    value: 'model-value',
    valueComparator: false,
  },
  VTextField: {
    ...inputs,
  },
  VTextarea: {
    ...inputs,
  },
  VFileInput: {
    type: false,
    ...inputs,
  },
  VSelect: {
    ...select,
  },
  VAutocomplete: {
    ...select,
  },
  VCombobox: {
    ...select,
  },
  VInput: {
    ...inputs,
  },
  VDialog: {
    ...overlay,
  },
  VMenu: {
    allowOverflow: false,
    auto: false,
    bottom: { name: 'location', value: 'bottom' },
    closeOnClick: {
      name: 'persistent',
      bind: true,
      value: value => value ? `!(${value})` : false,
    },
    left: { name: 'location', value: 'left' },
    nudgeBottom: { custom: 'offset' },
    nudgeLeft: { custom: 'offset' },
    nudgeRight: { custom: 'offset' },
    nudgeTop: { custom: 'offset' },
    nudgeWidth: false,
    offsetOverflow: false,
    offsetX: false,
    offsetY: false,
    positionX: false,
    positionY: false,
    right: { name: 'location', value: 'right' },
    rounded: false,
    tile: false,
    top: { name: 'location', value: 'top' },
    value: 'model-value',
    ...overlay,
  },
  VFooter: {
    fixed: false,
    outlined: false,
    padless: false,
    shaped: false,
    tile: false,
    width: false,
    ...size,
  },
  VForm: {
    value: 'model-value',
  },
  VHover: {
    value: 'model-value',
  },
  VIcon: {
    dense: { name: 'size', value: 'small' },
    disabled: false,
    left: 'start',
    right: 'end',
    ...sizes,
  },
  VImg: {
    contain: { custom: 'cover' },
    contentClass: false,
    position: false,
    ...theme,
  },
  VItemGroup: {
    activeClass: 'selected-class',
    value: 'model-value',
    valueComparator: false,
  },
  VItem: {
    activeClass: 'selected-class',
  },
  VLazy: {
    value: 'model-value',
  },
  VList: {
    dense: { name: 'density', value: 'compact' },
    expand: false,
    flat: false,
    outlined: false,
    subheader: false,
    threeLine: { name: 'lines', value: 'three' },
    twoLine: { name: 'lines', value: 'two' },
    tile: false,
  },
  VListGroup: {
    activeClass: false,
    disabled: false,
    eager: false,
    group: false,
    noAction: false,
    ripple: false,
    subGroup: false,
  },
  VListItem: {
    append: false,
    dense: { name: 'density', value: 'compact' },
    selectable: { custom: 'value' },
    threeLine: { name: 'lines', value: 'three' },
    twoLine: { name: 'lines', value: 'two' },
    inputValue: { custom: 'active' },
    ...link,
  },
  VNavigationDrawer: {
    app: false,
    bottom: { name: 'location', value: 'bottom' },
    clipped: false,
    fixed: false,
    height: false,
    hideOverlay: { name: 'scrim', bind: true, value: false },
    miniVariant: 'rail',
    miniVariantWidth: 'rail-width',
    mobileBreakPoint: false,
    overlayColor: 'scrim',
    overlayOpacity: false,
    right: { name: 'location', value: 'right' },
    src: 'image',
    stateless: false,
    value: 'model-value',
    ...theme,
  },
  VOverlay: {
    color: 'scrim',
    opacity: false,
    value: 'model-value',
  },
  VPagination: {
    circle: 'rounded',
    value: 'model-value',
    wrapperAriaLabel: 'aria-label',
  },
  VProgressCircular: {
    button: false,
    value: 'model-value',
  },
  VProgressLinear: {
    backgroundColor: 'bg-color',
    backgroundOpacity: 'bg-opacity',
    bottom: false,
    fixed: false,
    query: false,
    top: false,
    value: 'model-value',
  },
  VRadio: {
    inputValue: 'model-value',
    activeClass: 'false',
    offIcon: 'false-icon',
    onIcon: 'true-icon',
    offValue: 'false-value',
    onValue: 'true-value',
  },
  VRadioGroup: {
    activeClass: false,
    backgroundColor: false,
    row: 'inline',
    column: false,
    multiple: false,
    ...inputs,
  },
  VSlider: {
    backgroundColor: false,
    tickLabels: 'ticks',
    ticks: { custom: 'show-ticks' },
    vertical: { name: 'direction', value: 'vertical' },
    height: false,
    loading: false,
    inverseLabel: false,
    ...inputs,
  },
  VRangeSlider: {
    backgroundColor: false,
    tickLabels: 'ticks',
    ticks: { custom: 'show-ticks' },
    vertical: { name: 'direction', value: 'vertical' },
    height: false,
    loading: false,
    inverseLabel: false,
    ...inputs,
  },
  VRating: {
    backgroundColor: false,
    closeDelay: false,
    dense: { name: 'density', value: 'compact' },
    halfIcon: false,
    iconLabel: 'item-aria-label',
    large: false,
    openDelay: false,
    value: 'model-value',
    ...sizes,
  },
  VSheet: {
    outlined: false,
    shaped: false,
    tile: false,
  },
  VSlideGroup: {
    activeClass: 'selected-class',
    mobileBreakPoint: false,
    value: 'model-value',
    valueComparator: false,
    ...theme,
  },
  VSnackbar: {
    app: false,
    bottom: { name: 'location', value: 'bottom' },
    centered: { custom: 'location' },
    elevation (attr) {
      if (attr.directive
        ? attr.value.type === 'VExpressionContainer' && attr.value.expression.type === 'Literal'
        : attr.value.type === 'VLiteral'
      ) {
        return { name: 'class', value: value => `elevation-${value}`, bind: false }
      } else if (attr.directive && attr.value.type === 'VExpressionContainer') {
        return { name: 'class', value: value => `\`elevation-$\{${value}}\``, bind: true }
      }
      return { name: 'class', custom: 'elevation-<value>' }
    },
    left: { name: 'location', value: 'left' },
    outlined: { name: 'variant', value: 'outlined' },
    right: { name: 'location', value: 'right' },
    shaped: false,
    text: false,
    tile: false,
    top: { name: 'location', value: 'top' },
    value: 'model-value',
    ...theme,
  },
  VSwitch: {
    ...inputs,
    inputValue: 'model-value',
    value: undefined,
  },
  VSystemBar: {
    app: false,
    fixed: false,
    lightsOut: false,
  },
  VTabs: {
    activeClass: false,
    alignWithTitle: { name: 'align-tabs', value: 'title' },
    backgroundColor: 'bg-color',
    centered: { name: 'align-tabs', value: 'center' },
    iconsAndText: 'stacked',
    right: { name: 'align-tabs', value: 'end' },
    value: 'model-value',
    vertical: { name: 'direction', value: 'vertical' },
    ...theme,
  },
  VTab: {
    activeClass: 'selected-class',
    link: false,
    ...link,
  },
  VThemeProvider: {
    root: false,
  },
  VTimeline: {
    alignTop: { name: 'align', value: 'top' },
    dense: { name: 'density', value: 'compact' },
    reverse: false,
  },
  VTimelineItem: {
    color: 'dot-color',
    left: false,
    right: false,
    ...theme,
    ...sizes,
  },
  VToolbar: {
    bottom: false,
    outlined: false,
    prominent: false,
    shaped: false,
    short: false,
    src: 'image',
    tile: false,
    width: false,
    ...size,
  },
  VToolbarItems: {
    tag: false,
  },
  VTooltip: {
    allowOverflow: false,
    bottom: { name: 'location', value: 'bottom' },
    closeOnClick: { name: 'persistent', value: true },
    left: { name: 'location', value: 'left' },
    nudgeBottom: { custom: 'offset' },
    nudgeLeft: { custom: 'offset' },
    nudgeRight: { custom: 'offset' },
    nudgeTop: { custom: 'offset' },
    nudgeWidth: false,
    positionX: false,
    positionY: false,
    right: { name: 'location', value: 'right' },
    top: { name: 'location', value: 'top' },
    value: 'model-value',
    ...overlay,
  },
  VWindow: {
    activeClass: 'selected-class',
    showArrowsOnHover: false,
    touchless: false,
    value: 'model-value',
    valueComparator: false,
    vertical: { name: 'direction', value: 'vertical' },
  },
  VWindowItem: {
    activeClass: 'selected-class',
  },
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed and deprecated props.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'{{ a }}' has been replaced with '{{ b }}'`,
      removed: `'{{ name }}' has been removed`,
      combined: `multiple {{ a }} attributes have been combined`,
    },
  },

  create (context) {
    return context.parserServices.defineTemplateBodyVisitor({
      VStartTag (tag) {
        const attrGroups = {}
        tag.attributes.forEach(attr => {
          if (['location'].includes(attr.key.name)) {
            attrGroups[attr.key.name] = attrGroups[attr.key.name] ?? []
            attrGroups[attr.key.name].push(attr)
          }
        })
        Object.values(attrGroups).forEach(attrGroup => {
          const [head, ...tail] = attrGroup
          if (!tail.length) return
          context.report({
            messageId: 'combined',
            data: {
              a: head.key.name,
            },
            node: head,
            fix (fixer) {
              return [
                fixer.replaceText(head.value, `"${attrGroup.map(a => a.value.value).join(' ')}"`),
                ...tail.map(a => fixer.remove(a)),
              ]
            },
          })
        })
      },
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
          : attr.key

        Object.entries(replacements[tag]).forEach(([test, replace]) => {
          if (hyphenate(test) === propName) {
            if (typeof replace === 'function') {
              replace = replace(attr)
            }

            if (replace === false) {
              context.report({
                messageId: 'removed',
                data: { name: propName },
                node: propNameNode,
              })
            } else if (typeof replace === 'string') {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace,
                },
                node: propNameNode,
                fix (fixer) {
                  return fixer.replaceText(propNameNode, replace)
                },
              })
            } else if (typeof replace === 'object' && 'name' in replace && 'value' in replace) {
              const oldValue = attr.directive ? context.getSourceCode().getText(attr.value.expression) : attr.value?.value
              const value = typeof replace.value === 'function'
                ? replace.value(oldValue)
                : replace.value
              if (value == null || value === oldValue) return
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: `${replace.name}="${value}"`,
                },
                node: propNameNode,
                fix (fixer) {
                  if (attr.directive && replace.bind !== false) {
                    if (replace.bind) {
                      if (value === 'true' || value === '!(false)') {
                        return fixer.replaceText(attr, replace.name)
                      }
                      return [fixer.replaceText(propNameNode, replace.name), fixer.replaceText(attr.value, `"${value}"`)]
                    } else {
                      const expression = context.getSourceCode().getText(attr.value.expression)
                      return [fixer.replaceText(propNameNode, replace.name), fixer.replaceText(attr.value, `"${expression} && '${value}'"`)]
                    }
                  } else {
                    return fixer.replaceText(attr, `${replace.bind ? ':' : ''}${replace.name}="${value}"`)
                  }
                },
              })
            } else if (typeof replace === 'object' && 'custom' in replace) {
              context.report({
                messageId: 'replacedWith',
                data: {
                  a: propName,
                  b: replace.custom,
                },
                node: propNameNode,
              })
            }
          }
        })
      },
    })
  },
}
