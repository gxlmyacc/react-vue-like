
const {
  removeAttrASTByIndex,
  parseCondition,
  createDisplayProp,
  expr2str,
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t }) {
  function JSXElementVisitor(path) {
    const showAttrName = options.attrName.show;

    let vShowIndex = path.node.openingElement.attributes.findIndex(attr => attr.name && expr2str(attr.name) === showAttrName);
    if (vShowIndex < 0) return;
    let vShow = path.node.openingElement.attributes[vShowIndex];
    const condition = parseCondition(vShow);

    removeAttrASTByIndex(path.node, vShowIndex);

    const styleAttr = path.node.openingElement.attributes.find(attr => attr.name && expr2str(attr.name) === 'style');
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
        styleProps.push(createDisplayProp(condition, t.identifier('undefined')));
      }
    } else {
      path.get('openingElement').pushContainer('attributes', t.JSXAttribute(
        t.JSXIdentifier('style'),
        t.JSXExpressionContainer(
          t.ObjectExpression([
            createDisplayProp(condition, t.identifier('undefined')),
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
