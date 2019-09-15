const { isReactVueLike } = require('../utils');

module.exports = function ({ types: t, template }) {
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
              if (!this.isReactVueLike) return path.stop();

              if (path.node.name.name === 'ref' && t.isStringLiteral(path.node.value)) {
                const ref = path.node.value;
                const keyAttr = path.parent.attributes.find(attr => attr.name && attr.name.name === 'key');
                let key = keyAttr ? keyAttr.value : t.identifier('undefined');
                if (t.isJSXExpressionContainer(key)) key = key.expression;
                path.node.value = t.jsxExpressionContainer(template('el => this._resolveRef($REF$, el, $KEY$)')({
                  $REF$: ref,
                  $KEY$: key
                }).expression);
              }
            }
          }, ctx);
        },
      },
    }
  };
};
