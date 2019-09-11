
const {
  removeAttrASTByIndex,
  parseCondition,
  createDisplayProp,
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t }) {
  function JSXElementVisitor(path) {
    const showAttrName = options.attrName.show;

    let vShowIndex = path.node.openingElement.attributes.findIndex(attr => attr.name && attr.name.name === showAttrName);
    if (vShowIndex < 0) return;
    let vShow = path.node.openingElement.attributes[vShowIndex];
    const condition = parseCondition(vShow);

    removeAttrASTByIndex(path.node, vShowIndex);

    const styleAttr = path.node.openingElement.attributes.find(attr => attr.name && attr.name.name === 'style');
    if (styleAttr) {
      const styleProps = styleAttr.value.expression.properties;
      const displayProp = styleProps.find(prop => prop.key.name === 'display');
      if (displayProp) {
        displayProp.value = t.ConditionalExpression(
          condition,
          displayProp.value,
          t.StringLiteral('none'),
        );
      } else {
        styleProps.push(createDisplayProp(condition, t.NullLiteral()));
      }
    } else {
      path.get('openingElement').pushContainer('attributes', t.JSXAttribute(
        t.JSXIdentifier('style'),
        t.JSXExpressionContainer(
          t.ObjectExpression([
            createDisplayProp(condition, t.NullLiteral()),
          ]),
        ),
      ));
    }
  }

  return {
    visitor: {
      JSXElement: JSXElementVisitor
    }
  };
};
