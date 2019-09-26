
const { appendAttrEvent, directiveRegx, parseDirective, bindModifiers, expr2var, escapeRegx } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx(escapeRegx(options.attrName.model));
  return {
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXAttribute(path) {
              const attr = path.node;
              if (!attr.name || !t.isJSXExpressionContainer(attr.value)) return;
              const parsed = parseDirective(expr2var(attr.name), attrName);
              if (!parsed) return;
              let name = parsed.arg || 'value';
              if (t.isJSXNamespacedName(attr.name)) {
                attr.name = t.jsxIdentifier(name);
              } else attr.name.name = name;

              let modifiers = parsed.modifiers;
              let value = attr.value.expression;
              let newValue = bindModifiers('e && e.target ? e.target.value : e', modifiers);
              let event = modifiers.lazy ? 'onBlur' : 'onChange';

              appendAttrEvent(path, event, t.arrowFunctionExpression(
                [t.identifier('e')],
                t.blockStatement([
                  template(`$1=${newValue}`)({ $1: value })
                ])
              ));
            }
          });
        }
      }
    }
  };
};
