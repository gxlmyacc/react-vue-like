const camelcase = require('camelcase');
const { expr2str } = require('../utils');

module.exports = function ({ types: t, template }) {
  const REGX = /^[a-z][a-z0-9]+-[a-z0-9]+/;
  return {
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXElement({ node: { openingElement } }) {
              let elementName = expr2str(openingElement.name);
              if (!REGX.test(elementName)) return;
              if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$component')) return;
              let componentName = camelcase(elementName, { pascalCase: true });
              openingElement.attributes.push(t.jsxAttribute(
                t.jsxIdentifier('$component'),
                t.jsxExpressionContainer(
                  template('$THIS$._c($NAME$)')({
                    $THIS$: t.thisExpression(),
                    $NAME$: t.stringLiteral(componentName)
                  }).expression
                )
              ));
            }
          });
        },
      },
    },

  };
};
