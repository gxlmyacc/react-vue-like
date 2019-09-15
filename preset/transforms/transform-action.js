const { findClassStaticPath, expr2var, isReactVueLike } = require('../utils');

const COMP_METHS = [
  'data',
  'provide',
  'render',
];

module.exports = function ({ types: t, template }) {
  // const flowExpr = template('ReactVueLike.flow')().expression;
  // const actionExpr = template('ReactVueLike.action')().expression;

  function asyncToGen(asyncPath) {
    asyncPath.node.async = false;
    asyncPath.node.generator = true;
    asyncPath.traverse({
      AwaitExpression(awaitPath) {
        awaitPath.replaceWith(t.yieldExpression(awaitPath.node.argument));
      }
    });
  }

  const handled = [];
  function FunctionExprVisitor(exprPath) {
    let expression = exprPath.node;
    if (handled.includes(expression)) return;
    handled.push(expression);

    let hasAssgin = false;
    exprPath.traverse({
      AssignmentExpression(path) {
        if (path.scope.block !== expression) return;
        if (!t.isMemberExpression(path.node.left)) return;
        hasAssgin = true;
        path.stop();
      }
    });
    if (!hasAssgin) return;

    if (expression.async) {
      asyncToGen(exprPath);
      expression = template('ReactVueLike.flow($1)')({ $1: expression }).expression;
    }

    exprPath.replaceWith(template('this._resolveEvent($HANDER$)')({
      $HANDER$: expression,
    }).expression);
  }

  function ClassVisitor(path) {
    if (!isReactVueLike(path)) return;

    let allMethods = [];

    let staticMethodPath = findClassStaticPath(path, 'methods');
    if (staticMethodPath) {
      staticMethodPath.traverse({
        ObjectMethod(path) {
          if (path.node.kind === 'method') allMethods.push(path);
        }
      });
    }
    path.traverse({
      ClassMethod(path) {
        if (path.node.kind !== 'method') return;
        allMethods.push(path);
      }
    });


    allMethods.forEach(path => {
      path.traverse({
        // ArrowFunctionExpression: FunctionExprVisitor,
        FunctionExpression: FunctionExprVisitor,
      });

      if (COMP_METHS.includes(expr2var(path.node.key))) return;

      // if (!path.node.decorators) path.node.decorators = [];
      if (path.node.async) {
        asyncToGen(path);
        // path.node.decorators.push(t.decorator(flowExpr));
      }
      // else path.node.decorators.push(t.decorator(actionExpr));
    });
  }

  return {
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
      CallExpression(path) {
        const callee = path.node.callee;
        if (t.isIdentifier(callee) && callee.name === 'action') {
          let a = path.scope.bindings.action;
          if (!a || !t.isImportDeclaration(a.path.parent)
            || a.path.parent.source.value !== 'react-vue-like') return;
        } else if (t.isMemberExpression(callee) && expr2var(callee) === 'ReactVueLike.action') {
          //
        } else return;
        path.traverse({
          FunctionExpression(funcPath) {
            if (funcPath.parent !== path.node) return;
            if (funcPath.node.async) asyncToGen(funcPath);
          }
        });
      }
    }
  };
};
