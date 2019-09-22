const { isReactVueLike, directiveRegx, parseDirective, memberExpr2Str, expr2var } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx('ref');
  const forRegx = options.forRegx;
  function ClassVisitor(path) {
    if (!isReactVueLike(path)) return;
    this.isReactVueLike = true;
  }
  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {};
          path.traverse({
            ClassDeclaration: ClassVisitor,
            ClassExpression: ClassVisitor,
            JSXAttribute(path) {
              if (!this.isReactVueLike
                || !path.node.name
                || !t.isStringLiteral(path.node.value)) return path.stop();

              const parsed = parseDirective(expr2var(path.node.name), attrName);
              if (!parsed) return;

              if (path.node.name.namespace) path.node.name = t.jsxIdentifier(parsed.name);
              else if (path.node.name.name !== parsed.name) path.node.name = t.jsxIdentifier(parsed.name);

              const ref = path.node.value;
              const useKey = parsed.arg === 'key' || parsed.modifiers.key;

              const funcParent = path.getFunctionParent();
              const isInFor = funcParent && funcParent.parentKey === 'arguments'
                && t.isCallExpression(funcParent.parent)
                && t.isMemberExpression(funcParent.parent.callee)
                && forRegx.test(memberExpr2Str(funcParent.parent.callee));
              let key;
              if (isInFor) {
                const keyAttr = useKey && path.parent.attributes.find(attr => attr.name && attr.name.name === 'key');
                if (useKey && keyAttr) {
                  key = keyAttr.value;
                  if (t.isJSXExpressionContainer(key)) key = key.expression;
                  key = t.callExpression(t.identifier('String'), [key]);
                } else {
                  let funcParams = funcParent.node.params;
                  if (funcParams.length < 2) {
                    if (!funcParams.length) funcParams.push(t.identifier('_v'));
                    funcParams.push(t.identifier('$index'));
                  }
                  key = funcParams[1];
                }
              }

              path.node.value = t.jsxExpressionContainer(template('el => this._resolveRef($1, el, $2)')({
                $1: ref,
                $2: key || t.identifier('undefined')
              }).expression);
            }
          }, ctx);
        },
      },
    }
  };
};
