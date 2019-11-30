const { findClassStaticPath, expr2var, isReactVueLike } = require('../utils');

const COMP_METHS = [
  'data',
  'provide',
  'render',
  'renderError',
];

module.exports = function ({ types: t, template }) {
  const flowExpr = template('ReactVueLike.flow')().expression;
  // const actionExpr = template('ReactVueLike.action')().expression;

  function asyncToGen(asyncPath) {
    let node = asyncPath.node;
    node.async = false;
    node.generator = true;
    asyncPath.traverse({
      AwaitExpression(awaitPath) {
        let parent = awaitPath.getFunctionParent();
        if (parent !== asyncPath) return;
        awaitPath.replaceWith(t.yieldExpression(awaitPath.node.argument));
      }
    });
    if (t.isArrowFunctionExpression(node)) {
      node = t.functionExpression(
        null,
        asyncPath.node.params,
        asyncPath.node.body,
        asyncPath.node.generator,
        asyncPath.node.async,
      );
      asyncPath.replaceWith(template('$1.bind(this)')({ $1: node }).expression);
    }
  }

  function isClassMember(path) {
    if (!t.isMemberExpression(path.node)) return;
    if (t.isThisExpression(path.node.object)) return true;
    if (t.isMemberExpression(path.node.object)) return isClassMember(path.get('object'));
    const object = path.get('object');
    let name = expr2var(object.node);
    let binding = object.scope.bindings[name];
    let funcParent = path.getFunctionParent();
    while (!binding && funcParent) {
      binding = funcParent.scope.bindings[name];
      funcParent = binding ? null : funcParent.getFunctionParent();
    }
    if (!binding) return;
    switch (binding.path.type) {
      case 'VariableDeclarator': return isClassMember(binding.path.get('init'));
      case 'Identifier':
        if (binding.kind === 'param') return true;
        return false;
      default: //
    }
    if (binding.constantViolations.length) return binding.constantViolations.some(c => {
      if (c.type === 'AssignmentExpression') return isClassMember(c.get('right'));
    });
  }

  function hasAssgin(exprPath) {
    let ret = false;
    exprPath.traverse({
      AssignmentExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!isClassMember(path.get('left'))) return;
        ret = true;
        path.stop();
      },
      CallExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!t.isMemberExpression(path.node.callee)
          || expr2var(path.node.callee) !== 'Object.assign') return;
        if (!isClassMember(path.get('arguments.0'))) return;
        ret = true;
        path.stop();
      },
      UpdateExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!isClassMember(path.get('argument'))) return;
        ret = true;
        path.stop();
      }
    });
    return ret;
  }

  let handled = [];
  function FunctionExprVisitor(exprPath) {
    let expression = exprPath.node;
    if (handled.includes(expression)) return;
    handled.push(expression);

    if (!hasAssgin(exprPath)) return;

    if (expression.async) {
      asyncToGen(exprPath);
      exprPath.replaceWith(template('ReactVueLike.flow($1)')({ $1: exprPath.node }).expression);
      return;
    }

    exprPath.replaceWith(template('$THIS$._a($HANDER$)')({
      $THIS$: t.thisExpression(),
      $HANDER$: expression,
    }).expression);
  }

  function ClassVisitor(path) {
    if (handled.includes(path.node)) return;
    handled.push(path.node);

    if (!isReactVueLike(path)) return;

    let allMethods = [];

    let flows = [];
    let { methodsPath: staticMethodPath, varName } = findClassStaticPath(path, 'methods');
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
        ArrowFunctionExpression: FunctionExprVisitor,
        // FunctionExpression: FunctionExprVisitor,
      });

      if (COMP_METHS.includes(expr2var(path.node.key))) return;

      // if (!path.node.decorators) path.node.decorators = [];
      if (path.node.async) {
        asyncToGen(path);
        flows.push(t.stringLiteral(expr2var(path.node.key)));
        // path.node.decorators.push(t.decorator(flowExpr));
      }
      // else path.node.decorators.push(t.decorator(actionExpr));
    });
    if (flows.length && varName) {
      let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
      parentPath.insertAfter(template(`${varName}.__flows = $1;`)({
        $1: t.arrayExpression(flows)
      }));
    }
  }

  return {
    pre(state) {
      handled = [];
    },
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
      CallExpression(path) {
        const callee = path.node.callee;
        let a;
        if (t.isIdentifier(callee) && callee.name === 'action') {
          a = path.scope.bindings.action;
          if (!a || !t.isImportDeclaration(a.path.parent)
            || a.path.parent.source.value !== 'react-vue-like') return;
        } else if (t.isMemberExpression(callee) && expr2var(callee) === 'ReactVueLike.action') {
          //
        } else return;
        const FunctionVisitor = function (funcPath) {
          if (funcPath.parent !== path.node) return;
          if (funcPath.node.async) {
            asyncToGen(funcPath);
            if (t.isMemberExpression(callee)) {
              callee.property.name = 'flow';
            } else if (a) {
              path.get('callee').replaceWith(flowExpr);
            }
          }
        };
        path.traverse({
          ArrowFunctionExpression: FunctionVisitor,
          FunctionExpression: FunctionVisitor,
        });
      }
    }
  };
};
