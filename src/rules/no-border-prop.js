'use strict';

const { isVueTemplate } = require('../util/helpers');
const { addClass, removeAttr } = require('../util/fixers');

module.exports = {
  meta: {
    docs: {
      description: 'Disallow the `border` prop; use Tailwind border utilities instead.',
      category: 'tailwindcss',
    },
    fixable: 'code',
    schema: [],
    messages: {
      replacedWith: `'border="{{ value }}"' should be replaced with class="{{ className }}"`,
      noFix: `'border' prop should be replaced with Tailwind border utility classes`,
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

        if (propName !== 'border') return;

        const element = attr.parent.parent;
        const propNameNode = attr.directive ? attr.key.argument : attr.key;

        // Boolean attribute (no value) — `border` with no `="..."`
        if (!attr.directive && !attr.value) {
          context.report({
            messageId: 'replacedWith',
            data: { value: '', className: 'border' },
            node: propNameNode,
            fix (fixer) {
              return [
                addClass(context, fixer, element, 'border'),
                removeAttr(context, fixer, attr),
              ];
            },
          });
          return;
        }

        // Get static value
        const value = attr.directive
          ? (attr.value?.expression?.type === 'Literal' ? String(attr.value.expression.value) : null)
          : attr.value?.value;

        if (value != null) {
          const className = value.split(/\s+/).filter(Boolean).map(part => `border-${part}`).join(' ');
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
