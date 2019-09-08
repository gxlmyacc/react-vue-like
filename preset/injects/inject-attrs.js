
const {
  expr2var,
  // extractNodeCode
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function wrapElementAttrs(path, element) {
    let attrs = [];
    // let hasSpread = false;
    element.openingElement.attributes.forEach(attr => {
      if (t.isJSXSpreadAttribute(attr)) {
        const expr = attr.argument;
        attrs.push(t.spreadElement(expr));
        // if (!hasSpread) {
        //   hasSpread = (t.isIdentifier(expr) && ['props', '$attrs'].includes(expr.name))
        //     || (t.isMemberExpression(expr)
        //       && ['this.props', 'this.$attrs'].includes(extractNodeCode(path, expr)));
        // }
      } else if (t.isJSXAttribute(attr)) {
        let value = attr.value;
        if (t.isJSXExpressionContainer(value)) value = value.expression;
        attrs.push(t.objectProperty(
          t.identifier(attr.name.name),
          value
        ));
      }
    });
    element.openingElement.attributes.splice(0,
      element.openingElement.attributes.length,
      t.jSXSpreadAttribute(
        template('this._resolveSpreadAttrs($TAG$, $PROPS$)')({
          $TAG$: t.stringLiteral(expr2var(element.openingElement.name)),
          $PROPS$: t.objectExpression(attrs),
          // $SPREAD$: t.booleanLiteral(hasSpread)
        }).expression
      ));
  }

  function traverseReturn(methodPath) {
    methodPath.traverse({
      ReturnStatement(returnPath) {
        wrapNode.call(this, returnPath, returnPath.node.argument, methodPath);
      }
    }, this);
  }

  function wrapNode(path, node, returnMethodPath) {
    switch (node.type) {
      case 'Identifier': {
        let constantViolations = path.scope.bindings[node.name]
          && path.scope.bindings[node.name].constantViolations;
        if (!constantViolations) return;
        constantViolations.forEach(p => wrapNode.call(this, p, p.node));
      }
        break;
      case 'JSXElement':
        wrapElementAttrs.call(this, path, node);
        break;
      case 'ConditionalExpression':
        wrapNode.call(this, path, node.consequent);
        wrapNode.call(this, path, node.alternate);
        break;
      case 'AssignmentExpression':
        if (node.operator !== '=') return;
        wrapNode.call(this, path, node.right);
        break;
      case 'LogicalExpression':
        if (['&&', '||'].includes(node.operator)) {
          // wrapNode.call(this, path, node.left);
          wrapNode.call(this, path, node.right);
        }
        break;
      case 'CallExpression':
        if (t.isMemberExpression(node.callee)
          && t.isThisExpression(node.callee.object)
          && t.isIdentifier(node.callee.property)) {
          let methodName = node.callee.property.name;
          let methodPath;
          if (this.methodsPath) {
            this.methodsPath.traverse({
              ObjectMethod(path) {
                if (path.node.kind === 'method' && expr2var(path.node.key) === methodName) {
                  methodPath = path;
                  path.stop();
                }
              }
            });
          }
          if (!methodPath && this.classPath) {
            this.classPath.traverse({
              ClassMethod(path) {
                if (path.node.kind === 'method' && expr2var(path.node.key) === methodName) {
                  methodPath = path;
                  path.stop();
                }
              }
            });
          }
          if (methodPath) traverseReturn.call(this, methodPath);
        }
        break;
      default:
        // empty
    }
  }

  return {
    visitor: {
      ClassDeclaration(path) {
        if (!path.node.superClass || path.node.superClass.name !== 'ReactVueLike') return;
        const className = path.node.id.name;
        const ctx = {
          classPath: path,
          methodsPath: null
        };
        path.parentPath.traverse({
          ExpressionStatement(path) {
            const expr = path.node;
            if (this.methodsPath) return path.stop();
            if (!t.isCallExpression(expr)
              && t.isIdentifier(expr.expression.callee)
              && expr2var(expr.expression.callee) !== '_defineProperty'
              && t.isIdentifier(expr.expression.arguments[0])
              && expr2var(expr.expression.arguments[0]) !== className
              && expr2var(expr.expression.arguments[1]) !== 'methods') return path.skip();
            path.traverse({
              ObjectExpression(path) {
                if (path.parent !== expr.expression) return path.skip();
                this.methodsPath = path;
                path.stop();
              }
            }, this);
            if (this.methodsPath) path.stop();
          }
        }, ctx);

        path.traverse({
          ClassMethod(path) {
            const node = path.node;
            if (node.kind === 'method' && expr2var(node.key) === 'render') {
              traverseReturn.call(this, path);
              path.stop();
            }
          }
        }, ctx);
      },
    }
  };
};
