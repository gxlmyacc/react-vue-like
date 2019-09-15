const camelcase = require('camelcase');

module.exports = function ({ types: t, template }) {
  const REGX = /^[a-z][a-z0-9]+-[a-z0-9]+/;
  return {
    visitor: {
      JSXElement({ node: { openingElement } }) {
        let elementName = openingElement.name.name;
        if (!REGX.test(elementName)) return;
        if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$component')) return;
        let componentName = camelcase(elementName, { pascalCase: true });
        openingElement.attributes.push(t.jsxAttribute(
          t.jsxIdentifier('$component'),
          t.jsxExpressionContainer(
            template('this._resolveComp($NAME$)')({
              $NAME$: t.stringLiteral(componentName)
            }).expression
          )
        ));
      }
    }
  };
};
