
const {
  isReactVueLike,
  isReactVueLikeMixin,
  findClassVarName
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    if (!isReactVueLike(path)) return;

    const varName = findClassVarName(path);
    let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
    parentPath.insertAfter(template(`${varName}.__vuelike${isReactVueLikeMixin(path) ? 'Mixin' : ''} = true;`)({}));
  }


  return {
    pre(state) {
      this.handled = [];
    },
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
    },
  };
};
