const alignmentClasses = [
  /^align-(content-)?(start|baseline|center|end|space-around|space-between)$/,
  /^justify-(start|center|end|space-around|space-between)$/
]

// These attributes have alternative props, so shouldn't be turned into classes by the fixer
const noFix = {
  VContainer: [...alignmentClasses, /^grid-list-(xs|sm|md|lg|xl)$/],
  VRow: [...alignmentClasses, 'row', 'column', 'reverse', 'wrap'],
  VCol: [
    /^align-self-(start|baseline|center|end)$/,
    /^offset-(xs|sm|md|lg|xl)\d{1,2}$/,
    /^order-(xs|sm|md|lg|xl)\d{1,2}$/,
    /^(xs|sm|md|lg|xl)\d{1,2}$/,
    'grow', 'shrink'
  ]
}

function isGridAttribute (tag, name) {
  return noFix[tag] && noFix[tag].some(match => {
    return match instanceof RegExp ? match.test(name) : name === match
  })
}

module.exports = {
  isGridAttribute
}
