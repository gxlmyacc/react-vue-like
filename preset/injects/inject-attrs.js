
const {
  expr2var,
  findClassStaticPath,
  isReactVueLike,
  // extractNodeCode
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const inheritAttrs = new RegExp(`^[^(${options.prefix.replace(/-/g, '\\-')})|_|$][A-Za-z0-9\\-_]+$`);
  function wrapElementAttrs(path, element) {
    // if (this.cached.includes(element)) return;
    // this.cached.push(element);
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
      } else if (t.isJSXAttribute(attr) && inheritAttrs.test(expr2var(attr.name))) {
        let value = attr.value;
        if (t.isJSXExpressionContainer(value)) value = value.expression;
        attrs.push(t.objectProperty(
          t.identifier(expr2var(attr.name)),
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
        if (methodPath.scope.block !== returnPath.scope.block) return;
        wrapNode.call(this, returnPath.get('argument'), returnPath.node.argument, methodPath);
      }
    }, this);
  }

  function wrapNode(path, node, returnMethodPath, doBreak) {
    if (this.cached.includes(node)) return;
    this.cached.push(node);
    switch (node.type) {
      case 'Identifier': {
        let binding = path.scope.bindings[node.name];
        if (!binding) return;
        let constantViolations = binding.constantViolations;
        let isBreak = false;
        [binding.path, ...constantViolations].some(p => {
          wrapNode.call(this, p, p.node, () => isBreak = true);
          return isBreak;
        });
      }
        break;
      case 'JSXElement':
        wrapElementAttrs.call(this, path, node);
        break;
      case 'ConditionalExpression':
        wrapNode.call(this, path.get('consequent'), node.consequent);
        wrapNode.call(this, path.get('alternate'), node.alternate);
        break;
      case 'VariableDeclarator':
        wrapNode.call(this, path.get('init'), node.init);
        break;
      case 'FunctionExpression':
        traverseReturn.call(this, path);
        break;
      case 'ArrowFunctionExpression':
        if (t.isBlockStatement(node.body)) traverseReturn.call(this, path);
        else wrapNode.call(this, path.get('body'), node.body);
        break;
      case 'AssignmentExpression':
        if (node.operator !== '=') return;
        // if (doBreak) {
        // }
        wrapNode.call(this, path.get('right'), node.right);
        break;
      case 'LogicalExpression':
        if (['&&', '||'].includes(node.operator)) {
          // wrapNode.call(this, path.get('left'), node.left);
          wrapNode.call(this, path.get('right'), node.right);
        }
        break;
      case 'CallExpression':
        if (t.isIdentifier(node.callee)) {
          wrapNode.call(this, path.get('callee'), node.callee);
        } else if (t.isMemberExpression(node.callee)
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

  function ClassVisitor(path) {
    if (!isReactVueLike(path)) return;
    const ctx = {
      cached: [],
      classPath: path,
      methodsPath: findClassStaticPath(path, 'methods').methodsPath
    };
    path.traverse({
      ClassMethod(path) {
        const node = path.node;
        if (node.kind === 'method' && expr2var(node.key) === 'render') {
          traverseReturn.call(this, path);
          path.stop();
        }
      }
    }, ctx);
  }

  return {
    visitor: {
      Program: {
        exit(path) {
          path.traverse({
            ClassDeclaration: ClassVisitor,
            ClassExpression: ClassVisitor
          });
        }
      }
    }
  };
};
