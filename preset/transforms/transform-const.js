
const {
  getConstCache
} = require('../utils');

module.exports = function ({ types: t }) {
  function IdentifierVisitor(path) {
    const parent = path.parent;
    if (!parent) return;
    if (['FunctionDeclaration', 'MemberExpression', 'VariableDeclarator'].includes(parent.type)) return;
    if (parent.type === 'ObjectProperty' && parent.key === path.node) {
      return;
    }
    if (path.node.name === '__filename') {
      path.replaceWith(t.stringLiteral(this.filename));
    } else if (path.node.name === '__dirname') {
      path.replaceWith(t.stringLiteral(this.dirname));
    } else if (path.node.name === '__now') {
      path.replaceWith(t.stringLiteral(this.now));
    } else if (this.pkg) {
      if (path.node.name === '__packagename') {
        path.replaceWith(t.stringLiteral(this.pkg.name));
      } else if (path.node.name === '__packageversion') {
        path.replaceWith(t.stringLiteral(this.pkg.version));
      }
    }
  }

  return {
    visitor: {
      Program: {
        enter(path,
          {
            file: {
              opts: { filename }
            },
          }) {
          const cache = getConstCache(filename);

          path.traverse({
            Identifier: IdentifierVisitor
          }, cache);
        },
      },
    }
  };
};
