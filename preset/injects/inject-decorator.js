const {
  LibraryDecoratorName,
  isVuelikeClass,
  importSpecifier
} = require('../utils');

module.exports = function ({ types: t, template }) {
  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {
            decoratorSpecifier: null,
          };

          path.traverse({
            ClassDeclaration(path) {
              if (!isVuelikeClass(path)) return;
              if (!this.decoratorSpecifier) {
                this.decoratorSpecifier = importSpecifier(path, LibraryDecoratorName);
              }
              if (!path.node.decorators) path.node.decorators = [];
              else if (path.node.decorators.some(
                v => t.isIdentifier(v.expression) && v.expression.name === this.decoratorSpecifier.local.name
              )) return;
              path.node.decorators.unshift(t.decorator(t.identifier(this.decoratorSpecifier.local.name)));
            }
          }, ctx);
        },
      },
    }
  };
};
