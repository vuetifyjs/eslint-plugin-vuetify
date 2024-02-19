module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow import from "vuetify/lib/util/colors", suggest "vuetify/util/colors" instead',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create (context) {
    return {
      ImportDeclaration (node) {
        const source = node.source.value
        if (source === 'vuetify/lib/util/colors') {
          context.report({
            node,
            message: 'Import from "vuetify/lib/util/colors" is deprecated. Use "vuetify/util/colors" instead.',
            fix (fixer) {
              const fixedSource = source.replace('vuetify/lib/util/colors', 'vuetify/util/colors')
              return fixer.replaceText(node.source, `'${fixedSource}'`)
            },
          })
        }
      },
    }
  },
}
