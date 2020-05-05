const camelcase = require('camelcase');
const { expr2str, LibraryName } = require('../utils');

module.exports = function ({ types: t, template }) {
  const REGX = /^[a-z][a-z0-9]*-[a-z0-9]+/;
  return {
    visitor: {
      Program: {
        // enter(path) {
        //   path.traverse({
        //     JSXElement({ node: { openingElement } }) {
        //       let elementName = expr2str(openingElement.name);
        //       if (!REGX.test(elementName)) return;
        //       if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$component')) return;
        //       let componentName = camelcase(elementName, { pascalCase: true });
        //       openingElement.attributes.push(t.jsxAttribute(
        //         t.jsxIdentifier('$component'),
        //         t.jsxExpressionContainer(
        //           template('$THIS$._c($NAME$)')({
        //             $THIS$: t.thisExpression(),
        //             $NAME$: t.stringLiteral(componentName)
        //           }).expression
        //         )
        //       ));
        //     }
        //   });
        // },
        exit(path) {
          this.ctx = { createElementList: [], path };
        }
      },
    },
    post(state) {
      if (!this.ctx) return;
      this.ctx.path.traverse({
        CallExpression(path) {
          const node = path.node;
          if (node.callee.name && node.callee.name === 'require' 
            && t.isStringLiteral(node.arguments[0])) {
            let requireLibName = node.arguments[0].value;
            if (requireLibName === 'react') {
              let varPath = path.findParent(p => p.isVariableDeclarator());
              if (varPath) this.createElementList.push(`${varPath.node.id.name}.default.createElement`);
            } else if (requireLibName === LibraryName) {
              let varPath = path.findParent(p => p.isVariableDeclarator());
              if (varPath) this.createElementList.push(`${varPath.node.id.name}.default._ce`);
            }
          }
          if (!this.createElementList.length) return;
          
          if (!t.isMemberExpression(node.callee) 
            || !t.isStringLiteral(node.arguments[0])) return;
          const elementName = node.arguments[0].value;
          if (!REGX.test(elementName)) return;

          const calleeName = expr2str(node.callee);
          if (!this.createElementList.includes(calleeName)) return;
   

          let componentName = camelcase(elementName, { pascalCase: true });
          node.arguments[0] = template('$THIS$._c($NAME$)')({
            $THIS$: t.thisExpression(),
            $NAME$: t.stringLiteral(componentName)
          }).expression;
        }
      }, this.ctx);
    }
  };
};
