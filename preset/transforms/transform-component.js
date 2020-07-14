const camelcase = require('camelcase');
const { 
  expr2str, 
  LibraryName,
  InstanceName,
  findAllClassAllMethods,
  isVuelikeClasses,
  // isVuelikeClassHoc,
  importDefaultSpecifier,
  findInstanceSpecifier,
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const REGX = /^[a-z][a-z0-9]*-[a-z0-9]+/;

  function getJSXElementVisitor(useVuelikeInstance) {
    return function (path) {
      const openingElement = path.node.openingElement;
      let elementName = expr2str(openingElement.name);
      if (!REGX.test(elementName)) return;
      if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$component')) return;

      if (useVuelikeInstance && !this.instanceSpecifier) {
        this.instanceSpecifier = importDefaultSpecifier(path, InstanceName, options.vuelikePath);
      }

      let componentName = camelcase(elementName, { pascalCase: true });
      openingElement.attributes.unshift(t.jsxAttribute(
        t.jsxIdentifier('$component'),
        t.jsxExpressionContainer(
          template('$THIS$._c($NAME$)')({
            $THIS$: useVuelikeInstance ? InstanceName : t.thisExpression(),
            $NAME$: t.stringLiteral(componentName)
          }).expression
        )
      ));
    };
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {
            instanceSpecifier: findInstanceSpecifier(path, options.vuelikePath),
          };
          let classes = findAllClassAllMethods(path, { staticVars: ['methods', 'computed', 'watch'] });
          classes.forEach(({ classPath, methods }) => {
            if (!isVuelikeClasses(classPath) /* && !isVuelikeClassHoc(classPath, options.vuelikePath) */) return;
            methods.forEach(methodPath => {
              methodPath.traverse({
                JSXElement: getJSXElementVisitor(false)
              }, ctx);
            });
          });

   
          path.traverse({
            JSXElement: getJSXElementVisitor(true),
          }, ctx);
        },
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

          let propsNode = node.arguments[1];
          if (t.isCallExpression(propsNode)) propsNode = propsNode.arguments[0];
          if (!propsNode || !t.isObjectExpression(propsNode)) return;

          let componentNodeIndex = propsNode.properties.findIndex(v => t.isObjectProperty(v) && expr2str(v.key) === '$component');
          if (~componentNodeIndex) {
            node.arguments[0] = propsNode.properties[componentNodeIndex].value;
            propsNode.properties.splice(componentNodeIndex, 1);
          }
        }
      }, this.ctx);
    }
  };
};
