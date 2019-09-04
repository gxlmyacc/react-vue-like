
module.exports = function ({ types: t, template }) {
  function ClassDeclarationVisitor(path) {
    if (path.node.superClass && path.node.superClass.name === 'ReactVueLike') {
      path.insertAfter(template(`${path.node.id.name}.__file = $FILE$;`)({
        $FILE$: t.identifier('__filename')
      }));
    }
  }


  return {
    visitor: {
      ClassDeclaration: ClassDeclarationVisitor,
    }
  };
};
