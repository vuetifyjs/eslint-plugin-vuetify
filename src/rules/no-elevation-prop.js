'use strict';

const { isVueTemplate } = require('../util/helpers');
const { addClass, removeAttr } = require('../util/fixers');

const validElevations = new Set(['0', '1', '2', '3', '4', '5']);

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the `elevation` prop; use Tailwind shadow utilities instead.',
      category: 'tailwindcss',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'elevation="{{ value }}"' should be replaced with class="{{ className }}"`,
      noFix: `'elevation' prop should be replaced with a Tailwind shadow utility class`,
    },
  },
  create (context) {
    if (!isVueTemplate(context)) return {};

    return context.sourceCode.parserServices.defineTemplateBodyVisitor({
      VAttribute (attr) {
        if (attr.directive && (attr.key.name.name !== 'bind' || !attr.key.argument)) return;

        const propName = attr.directive
          ? attr.key.argument.rawName
          : attr.key.rawName;

        if (propName !== 'elevation') return;

        const element = attr.parent.parent;
        const propNameNode = attr.directive ? attr.key.argument : attr.key;

        // Get static value
        const value = attr.directive
          ? (attr.value?.expression?.type === 'Literal' ? String(attr.value.expression.value) : null)
          : attr.value?.value;

        if (value != null && validElevations.has(value)) {
          const className = `elevation-${value}`;
          context.report({
            messageId: 'replacedWith',
            data: { value, className },
            node: propNameNode,
            fix (fixer) {
              return [
                addClass(context, fixer, element, className),
                removeAttr(context, fixer, attr),
              ];
            },
          });
        } else {
          context.report({
            messageId: 'noFix',
            node: propNameNode,
          });
        }
      },
    });
  },
};
