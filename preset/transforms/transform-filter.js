const {
  arr2Expression,
  memberExpr2Str,
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function JSXElementVisitor(path) {
    path.traverse({
      JSXExpressionContainer: JSXExpressionContainerVisitor
    }, this);
  }

  // eslint-disable-next-line
  const filterTemplate = (callee, args) => {
    let method = t.isArrayExpression(args) ? 'apply' : 'call';
    return template(`$THIS$._f(() => $THIS$.$filters.${callee}.${method}(null, $ARGS$), '${callee}')`)({
      $THIS$: t.thisExpression(),
      $ARGS$: args
    });
  };

  function JSXExpressionContainerVisitor(path) {
    if (path.parent.type !== 'JSXElement') return;
    const { expression } = path.node;
    if (expression.type !== 'BinaryExpression' && expression.operator !== '|') return;

    this.hasFilter = true;

    let { left, right } = expression;

    let newExpr;
    if (t.isStringLiteral(right)) {
      // if (right.value.test(/^[a-z_][a-z0-9_]*\(.*\)$/i)) right = template(right.name)().expression;
      // else right = t.identifier(right.value);
      newExpr = filterTemplate(right.value, left);
    } else if (t.isIdentifier(right)) {
      newExpr = filterTemplate(right.name, left);
    } else if (t.isMemberExpression(right)) {
      let property = right;
      while (property.object) property = property.object;
      let args = [left];
      if (property.arguments) args.push(...property.arguments);
      let callee = memberExpr2Str(right);
      newExpr = filterTemplate(callee, arr2Expression(args).expression);
    } else if (t.isCallExpression(right)) {
      let callee = t.isMemberExpression(right.callee)
        ? memberExpr2Str(right.callee)
        : (right.callee.name || right.callee.value);
      newExpr = filterTemplate(callee, arr2Expression([left, ...right.arguments]).expression);
    }

    if (newExpr) path.node.expression = newExpr.expression;
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          const context = {
            hasFilter: false,
          };

          path.traverse({
            JSXElement: JSXElementVisitor
          }, context);
        },
      },
    }
  };
};
