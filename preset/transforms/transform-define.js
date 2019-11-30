
const {
  getConstCache,
  var2Expression
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t }) {
  let defines = options.transform.define;
  if (defines && typeof consts !== 'object') defines = {};
  let defineNames = Object.getOwnPropertyNames(defines);

  function IdentifierVisitor(path) {
    const parent = path.parent;
    if (!parent) return;
    if (['FunctionDeclaration', 'ClassMethod', 'ObjectMethod'].includes(parent.type)) return;
    if (parent.type === 'ObjectProperty' && parent.key === path.node) return;
    if (parent.type === 'MemberExpression' && parent.object !== path.node) return;
    if (parent.type === 'VariableDeclarator' && parent.id === path.node) return;

    const identifier = path.node.name;
    if (identifier === '__filename') {
      path.replaceWith(t.stringLiteral(this.filename));
    } else if (identifier === '__dirname') {
      path.replaceWith(t.stringLiteral(this.dirname));
    } else if (identifier === '__now') {
      path.replaceWith(t.stringLiteral(this.now));
    } else if (defineNames.includes(identifier)) {
      path.replaceWith(var2Expression(defines[identifier]));
    } else if (this.pkg) {
      if (identifier === '__packagename') {
        path.replaceWith(t.stringLiteral(this.pkg.name));
      } else if (identifier === '__packageversion') {
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
