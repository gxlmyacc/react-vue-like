const { LibraryVarName, isReactComponent, isImportSpecifier, importSpecifier } = require('../utils');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path) {
          if (!isReactComponent(path)) return;

          path.traverse({
            JSXElement(path) {
              path.stop();

              let declaration = isImportSpecifier(path, LibraryVarName);
              if (declaration) return;

              importSpecifier(path, `${LibraryVarName},default`);
            }
          });
        },
      },
    }
  };
};
