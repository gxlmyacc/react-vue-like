const { expr2var } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const htmlAttrName = options.attrName.html;
  return {
    visitor: {
      JSXElement(path) {
        let attr = path.node.openingElement.attributes.find(attr => attr.name && expr2var(attr.name) === htmlAttrName);
        if (!attr) return;
        attr.name.name = 'dangerouslySetInnerHTML';
        attr.value = t.jsxExpressionContainer(
          template('{ __html: $VALUE$ }')({
            $VALUE$: t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value
          }).expression
        );
      }
    }
  };
};
