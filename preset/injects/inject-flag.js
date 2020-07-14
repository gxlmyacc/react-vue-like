
const {
  ComponentFlagPrefix,
  isVuelikeClasses,
  isVuelikeClassHoc,
  isVuelikeClassMixin,
  findClassVarName
} = require('../utils');


module.exports = function ({ types: t, template }) {
  const options = require('../options');
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    const isClass = isVuelikeClasses(path);
    const isHoc = isVuelikeClassHoc(path, options.vuelikePath);

    if (!isClass && !isHoc) return;

    const varName = findClassVarName(path);
    if (!varName) return;

        
    let expr = template(`${varName}.${ComponentFlagPrefix}${
      isClass
        ? ''
        : isHoc
          ? 'Hoc'
          : isVuelikeClassMixin(path) 
            ? 'Mixin' 
            : ''
    } = true;`)({});

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
