'use strict'

function hyphenate (str = '') {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
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

module.exports = {
  hyphenate,
  isBuiltinAttribute
}
