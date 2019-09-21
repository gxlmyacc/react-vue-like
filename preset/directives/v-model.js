
const { appendAttrEvent, directiveRegx, parseDirective, bindModifiers } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx(options.attrName.model);
  return {
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXAttribute(path) {
              const attr = path.node;
              if (!attr.name || !t.isJSXExpressionContainer(attr.value)) return;
              const parsed = parseDirective(attr.name.name, attrName);
              if (!parsed) return;
              attr.name.name = parsed.arg || 'value';

              let modifiers = parsed.modifiers;
              let value = attr.value.expression;
              let newValue = bindModifiers('_e && _e.target ? _e.target.value : _e', modifiers);
              let event = modifiers.lazy ? 'onBlur' : 'onChange';

              appendAttrEvent(path, event, t.arrowFunctionExpression(
                [t.identifier('_e')],
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
