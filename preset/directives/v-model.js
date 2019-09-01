
const { objValueStr2AST, memberExpr2Str, appendAttrEvent } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t }) {
  let attrName = new RegExp(`^${options.attrName.model}(\\.\\w+)*$`);

  function JSXElementVisitor(path) {
    path.traverse({
      JSXAttribute: JSXAttributeVisitor
    });
  }

  function JSXAttributeVisitor(node) {
    if (!attrName.test(node.node.name.name)) return;

    let modelStr = memberExpr2Str(node.node.value.expression).split('.');
    if (modelStr[0] !== 'this') return;

    modelStr = modelStr.slice(1, modelStr.length).join('.');

    node.node.name.name = 'value';
    appendAttrEvent(node, 'onChange', t.arrowFunctionExpression(
      [t.identifier('e')],
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            objValueStr2AST('this.' + modelStr, t),
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
