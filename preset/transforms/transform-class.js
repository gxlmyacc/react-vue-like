const { isReactComponent, importSpecifier, expr2str, LibraryVarName } = require('../utils');

module.exports = function ({ types: t, template }) {
  const CLASSNAMES = `${LibraryVarName}._cn`;
  function JSXAttributeVisitor(path) {
    if (path.node.name.name !== 'className'
      || !t.isJSXExpressionContainer(path.node.value)
      || (t.isCallExpression(path.node.value.expression) 
        && expr2str(path.node.value.expression.callee) === CLASSNAMES)) return;

    if (!this.libraryVarSpecifier) {
      this.libraryVarSpecifier = importSpecifier(path, `${LibraryVarName},default`);
    }
    path.node.value.expression = template(`${CLASSNAMES}($EXPR$)`)({
      $EXPR$: path.node.value.expression
    }).expression;
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          if (!isReactComponent(path)) return;

          const ctx = {
            libraryVarSpecifier: null
          };
          path.traverse({
            JSXAttribute: JSXAttributeVisitor
          }, ctx);
        },
      },
    }
  };
};
