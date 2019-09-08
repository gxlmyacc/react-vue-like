
const { objValueStr2AST, memberExpr2Str, appendAttrEvent } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t }) {
  let attrName = new RegExp(`^${options.attrName.model}(\\.\\w+)*$`);

  function JSXElementVisitor(path) {
    path.traverse({
      JSXAttribute: JSXAttributeVisitor
    });
  }

  function JSXAttributeVisitor(path) {
    const attr = path.node;
    if (!attr.name
      || !attrName.test(attr.name.name)
      || !t.isJSXExpressionContainer(attr.value)) return;


    let value = memberExpr2Str(attr.value.expression);

    attr.name.name = 'value';
    appendAttrEvent(path, 'onChange', t.arrowFunctionExpression(
      [t.identifier('e')],
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            objValueStr2AST(value, t),
            objValueStr2AST('e.target.value', t)
          )
        )
      ])
    ));
  }

  return {
    visitor: {
      JSXElement: JSXElementVisitor
    }
  };
};
