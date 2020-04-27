
const {
  getConstCache,
  isObserverClass,
  findClassVarName
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path, {
    file: {
      opts: { filename }
    },
  }) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    if (!isObserverClass(path)) return;
    const cache = getConstCache(filename);

    const varName = findClassVarName(path);
    if (!varName) return;

    let expr = template(`${varName}.__file = $FILE$;`)({
      $FILE$: t.stringLiteral(cache.filename)
    });

    let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
    if (t.isReturnStatement(parentPath.node)) parentPath.insertBefore(expr);
    else parentPath.insertAfter(expr);
  }


  return {
    pre(state) {
      this.handled = [];
    },
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
    },
    // post(state) {
    // }
  };
};
