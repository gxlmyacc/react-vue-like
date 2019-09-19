const requires = require('../options').transform.require || {};

module.exports = function ({ types: t, template }) {
  const temp = template('require($1)');
  const requireKeys = Object.keys(requires);
  return {
    visitor: {
      JSXElement({ node: { openingElement } }) {
        let tagName = openingElement.name.name;
        if (!requireKeys.includes(tagName)) return;
        let attrName = requires[tagName];
        if (!attrName) return;
        const srcAttr = openingElement.attributes.find(attr => attr.name && attr.name.name === attrName);
        if (!srcAttr || !t.isStringLiteral(srcAttr.value) || /^data:/.test(srcAttr.value.value)) return;
        srcAttr.value = t.jsxExpressionContainer(temp({ $1: srcAttr.value.value }).expression);
      }
    }
  };
};
