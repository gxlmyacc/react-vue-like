
const {
  getConstCache,
  isReactVueLike,
  findClassVarName
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path, {
    file: {
      opts: { filename }
    },
  }) {
    if (this.handled.includes(path)) return;
    this.handled.push(path);

    if (!isReactVueLike(path)) return;
    const cache = getConstCache(filename);

    const varName = findClassVarName(path);
    let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
    parentPath.insertAfter(template(`${varName}.__file = $FILE$;`)({
      $FILE$: t.stringLiteral(cache.filename)
    }));
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
