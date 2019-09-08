
const {
  getConstCache
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassDeclarationVisitor(path, {
    file: {
      opts: { filename }
    },
  }) {
    if (path.node.superClass && path.node.superClass.name === 'ReactVueLike') {
      const cache = getConstCache(filename);
      path.insertAfter(template(`${path.node.id.name}.__file = $FILE$;`)({
        $FILE$: t.stringLiteral(cache.filename)
      }));
    }
  }


  return {
    visitor: {
      ClassDeclaration: ClassDeclarationVisitor,
    }
  };
};
