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

module.exports = {
  addClass
}
