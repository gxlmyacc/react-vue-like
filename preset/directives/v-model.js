
const { objValueStr2AST, memberExpr2Str, appendAttrEvent } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  let attrName = new RegExp(`^${options.attrName.model}(\\.\\w+)*$`);

  return {
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXAttribute(path) {
              const attr = path.node;
              if (!attr.name
                  || !attrName.test(attr.name.name)
                  || !t.isJSXExpressionContainer(attr.value)) return;


              let value = memberExpr2Str(attr.value.expression);

              attr.name.name = 'value';
              appendAttrEvent(path, 'onChange', t.arrowFunctionExpression(
                [t.identifier('e')],
                t.blockStatement([
                  template('$1 = e && e.target ? e.target.value : e')({
                    $1: objValueStr2AST(value, t)
                  })
                ])
              ));
            }
          });
        }
      }
    }
  };
};
