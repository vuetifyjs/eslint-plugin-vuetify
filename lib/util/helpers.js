'use strict'

function hyphenate (str = '') {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

function classify (str) {
  return str
    .replace(/(?:^|[-_])(\w)/g, c => c.toUpperCase())
    .replace(/[-_]/g, '')
}

const specialAttrs = [
  'style', 'class', 'id',
  'contenteditable', 'draggable', 'spellcheck',
  'key', 'ref', 'slot', 'is', 'slot-scope'
]

function isBuiltinAttribute (name) {
  return specialAttrs.includes(name) ||
  name.startsWith('data-') ||
  name.startsWith('aria-')
}

function getAttributes (element) {
  const attrs = []
  element.startTag.attributes.forEach(node => {
    if (node.directive && (node.key.name !== 'bind' || !node.key.argument)) return

    const name = hyphenate(node.directive ? node.key.argument : node.key.rawName)
    if (isBuiltinAttribute(name)) return
    attrs.push({ name, node })
  })
  return attrs
}

module.exports = {
  hyphenate,
  classify,
  isBuiltinAttribute,
  getAttributes
}
