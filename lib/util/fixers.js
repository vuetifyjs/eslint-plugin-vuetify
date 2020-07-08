function addClass (context, fixer, element, className) {
  const classNode = element.startTag.attributes.find(attr => attr.key.name === 'class')

  if (classNode && classNode.value) {
    // class=""
    return fixer.replaceText(classNode.value, `"${classNode.value.value} ${className}"`)
  } else if (classNode) {
    // class
    return fixer.insertTextAfter(classNode, `="${className}"`)
  } else {
    // nothing
    return fixer.insertTextAfter(
      context.parserServices.getTemplateBodyTokenStore().getFirstToken(element.startTag),
      ` class="${className}"`
    )
  }
}

function removeAttr (context, fixer, node) {
  const source = context.getSourceCode().text
  let [start, end] = node.range
  // Remove extra whitespace before attributes
  start -= /\s*$/g.exec(source.substring(0, start))[0].length
  return fixer.removeRange([start, end])
}

module.exports = {
  addClass,
  removeAttr
}
