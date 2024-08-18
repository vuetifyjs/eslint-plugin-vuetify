'use strict'

const { classify, getAttributes } = require('../util/helpers')

const groups = [
  {
    components: ['VDialog', 'VMenu', 'VTooltip'],
    slots: ['activator'],
    handler (context, node, directive, param) {
      if (param.type === 'Identifier') {
        // #activator="data"
        const boundVariables = {}
        node.variables.find(variable => variable.id.name === param.name)?.references.forEach(ref => {
          if (ref.id.parent.type !== 'MemberExpression') return
          if (
            // v-bind="data.props"
            ref.id.parent.property.name === 'props' &&
            ref.id.parent.parent.parent.directive &&
            ref.id.parent.parent.parent.key.name.name === 'bind' &&
            !ref.id.parent.parent.parent.key.argument
          ) return
          if (ref.id.parent.property.name === 'on') {
            boundVariables.on = ref.id
          } else if (ref.id.parent.property.name === 'attrs') {
            boundVariables.attrs = ref.id
          }
        })
        if (boundVariables.on) {
          const ref = boundVariables.on
          context.report({
            node: ref,
            messageId: 'changedProps',
            data: {
              component: node.parent.name,
              slot: directive.key.argument.name,
            },
            fix (fixer) {
              return fixer.replaceText(ref.parent.parent.parent, `v-bind="${param.name}.props"`)
            },
          })
        }
        if (boundVariables.attrs) {
          const ref = boundVariables.attrs
          if (!boundVariables.on) {
            context.report({
              node: boundVariables.attrs,
              messageId: 'invalidProps',
            })
          } else {
            context.report({
              node: ref,
              messageId: 'changedProps',
              data: {
                component: node.parent.name,
                slot: directive.key.argument.name,
              },
              fix (fixer) {
                return fixer.removeRange([ref.parent.parent.parent.range[0] - 1, ref.parent.parent.parent.range[1]])
              },
            })
          }
        }
      } else if (param.type === 'ObjectPattern') {
        // #activator="{ on, attrs }"
        const boundVariables = {}
        param.properties.forEach(prop => {
          node.variables.find(variable => variable.id.name === prop.value.name)?.references.forEach(ref => {
            if (prop.key.name === 'on') {
              boundVariables.on = { prop, id: ref.id }
            } else if (prop.key.name === 'attrs') {
              boundVariables.attrs = { prop, id: ref.id }
            }
          })
        })
        if (boundVariables.on || boundVariables.attrs) {
          if (boundVariables.attrs && !boundVariables.on) {
            context.report({
              node: boundVariables.attrs.prop.key,
              messageId: 'invalidProps',
            })
          } else {
            context.report({
              node: param,
              messageId: 'changedProps',
              data: {
                component: node.parent.name,
                slot: directive.key.argument.name,
              },
              * fix (fixer) {
                if (boundVariables.on) {
                  const ref = boundVariables.on
                  yield fixer.replaceText(ref.prop, 'props')
                  yield fixer.replaceText(ref.id.parent.parent, `v-bind="props"`)
                }
                if (boundVariables.attrs) {
                  const template = context.getSourceCode().parserServices.getTemplateBodyTokenStore()
                  const ref = boundVariables.attrs
                  const isLast = ref.prop === param.properties.at(-1)
                  if (isLast) {
                    const comma = template.getTokenBefore(ref.prop, { filter: token => token.value === ',' })
                    if (comma) {
                      yield fixer.removeRange([comma.range[0], ref.prop.range[1]])
                    } else {
                      yield fixer.removeRange([ref.prop.range[0] - 1, ref.prop.range[1]])
                    }
                  } else {
                    const comma = template.getTokenAfter(ref.prop, { filter: token => token.value === ',' })
                    if (comma) {
                      yield fixer.removeRange([ref.prop.range[0] - 1, comma.range[1]])
                    } else {
                      yield fixer.removeRange([ref.prop.range[0] - 1, ref.prop.range[1]])
                    }
                  }
                  yield fixer.removeRange([ref.id.parent.parent.range[0] - 1, ref.id.parent.parent.range[1]])
                }
              },
            })
          }
        }
      } else {
        context.report({
          node: directive,
          messageId: 'invalidProps',
        })
      }
    },
  },
  {
    components: ['VSelect', 'VAutocomplete', 'VCombobox'],
    slots: ['selection'],
    handler (context, node, directive, param) {
      if (!getAttributes(node.parent).some(attr => ['chips', 'closable-chips'].includes(attr.name))) return

      context.report({
        node: directive,
        messageId: 'renamed',
        data: {
          component: node.parent.name,
          slot: directive.key.argument.name,
          newSlot: 'chip',
        },
        fix (fixer) {
          return fixer.replaceText(directive.key.argument, 'chip')
        },
      })
    },
  },
  {
    components: ['VSnackbar'],
    slots: ['action'],
    handler (context, node, directive, param) {
      context.report({
        node: directive,
        messageId: 'renamed',
        data: {
          component: node.parent.name,
          slot: directive.key.argument.name,
          newSlot: 'actions',
        },
        fix (fixer) {
          return fixer.replaceText(directive.key.argument, 'action')
        },
      })
    },
  },
]

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent the use of removed and deprecated slots.',
      category: 'recommended',
    },
    fixable: 'code',
    schema: [],
    messages: {
      renamed: `{{ component }}'s '{{ slot }}' slot has been renamed to '{{ newSlot }}'`,
      changedProps: `{{ component }}'s '{{ slot }}' slot has changed props`,
      invalidProps: `Slot has invalid props`,
    },
  },

  create (context) {
    let scopeStack

    const sourceCode = context.getSourceCode()
    return sourceCode.parserServices.defineTemplateBodyVisitor({
      VElement (node) {
        scopeStack = {
          parent: scopeStack,
          nodes: scopeStack ? [...scopeStack.nodes] : [],
        }
        for (const variable of node.variables) {
          scopeStack.nodes.push(variable.id)
        }

        if (node.name !== 'template' || node.parent.type !== 'VElement') return

        for (const group of groups) {
          if (
            !group.components.includes(classify(node.parent.name)) &&
            !group.components.includes(node.parent.name)
          ) continue
          const directive = node.startTag.attributes.find(attr => {
            return (
              attr.directive &&
              attr.key.name.name === 'slot' &&
              group.slots.includes(attr.key.argument?.name)
            )
          })
          if (
            !directive ||
            !directive.value ||
            directive.value.type !== 'VExpressionContainer' ||
            !directive.value.expression ||
            directive.value.expression.params.length !== 1
          ) continue
          const param = directive.value.expression.params[0]
          group.handler(context, node, directive, param)
        }
      },
      'VElement:exit' () {
        scopeStack = scopeStack && scopeStack.parent
      },
    })
  },
}
