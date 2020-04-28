
const {
  ComponentFlagPrefix,
  isObserverClass,
  isObserverClassMixin,
  findClassVarName
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    if (!isObserverClass(path)) return;

    const varName = findClassVarName(path);
    if (!varName) return;

    let expr = template(`${varName}.${ComponentFlagPrefix}${isObserverClassMixin(path) ? 'Mixin' : ''} = true;`)({});

    let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
    if (t.isReturnStatement(parentPath.node)) parentPath.insertBefore(expr);
    else parentPath.insertAfter(expr);
  }


  return {
    pre(state) {
      this.handled = [];
    },
    visitor: {
      Program: {
        enter(path) {
          const ctx = { handled: [] };
          path.traverse({
            ClassDeclaration: ClassVisitor,
            ClassExpression: ClassVisitor,
          }, ctx);
        }
      }
    }
  };
};
