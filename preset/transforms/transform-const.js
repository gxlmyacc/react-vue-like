
const {
  resolve,
  relative,
  dirname
} = require('path');
const findUp = require('find-up');
const { fileExists } = require('../utils');

function getConfigPath(filename) {
  let packagePath = findUp.sync('package.json', {
    cwd: dirname(filename),
    type: 'file'
  });
  if (packagePath && fileExists(packagePath)) return packagePath;
}

const cached = {};

const NOW = (new Date()).format('yyyy-MM-dd hh:mm:ss');

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
          const pkgPath = getConfigPath(filename);
          if (!pkgPath || filename === resolve(pkgPath)) return;

          let cwd;

          let cache = cached[pkgPath];
          if (!cache) {
            let pkg = require(pkgPath);
            if (!pkg || !Object.keys(pkg).length) return;

            cwd = dirname(pkgPath);

            cache = { pkg, cwd };
            cached[pkgPath] = cache;

            cache.filename = '/' + relative(cwd, filename).replace(/\\/g, '/');
            cache.dirname = '/' + relative(cwd, dirname(filename)).replace(/\\/g, '/');
            cache.now = NOW;
          }

          path.traverse({
            Identifier: IdentifierVisitor
          }, cache);
        },
      },
    }
  };
};
