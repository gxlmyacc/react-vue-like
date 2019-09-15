
const {
  DirectiveName,
  childrenToArrayExpr,
  isReactVueLike
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (!isReactVueLike(path)) return;

    path.traverse({
      ClassMethod(path) {
        const node = path.node;
        if (node.kind !== 'method') return;

        path.traverse({
          JSXElement(compPath) {
            const tagName = compPath.node.openingElement.name.name;
            if (tagName !== 'slot') return;
            let nameAttr;
            let slotScopes = [];
            compPath.node.openingElement.attributes.forEach(attr => {
              if (t.isJSXSpreadAttribute(attr)) {
                slotScopes.push(t.spreadElement(attr.argument));
                return;
              }
              if (attr.name.name === 'name') nameAttr = attr;
              else {
                slotScopes.push(t.objectProperty(
                  t.identifier(attr.name.name),
                  attr.value
                ));
              }
            });
            let slotName = nameAttr ? nameAttr.name : 'default';
            compPath.replaceWith(t.jsxExpressionContainer(
              template('this._resolveSlot($SLOTNAME$, $SCOPE$, $CHILDREN$)')({
                $SLOTNAME$: t.stringLiteral(slotName),
                $SCOPE$: t.objectExpression(slotScopes),
                $CHILDREN$: childrenToArrayExpr(compPath.node.children)
              }).expression
            ));
            return path.skip();
          }
        });
      }
    });
  }
  return {
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
      JSXElement(path) {
        const tagName = path.node.openingElement.name.name;
        if (!/^[A-Z]/.test(tagName) || tagName === DirectiveName) return;
        if (path.node.openingElement.attributes.find(attr => attr.name && attr.name.name === '$slots')) return;
        let slots = [];
        path.traverse({
          JSXElement(slotPath) {
            let slotAttrIndex = slotPath.node.openingElement.attributes.findIndex(a => a.name && a.name.name === 'slot');
            if (!~slotAttrIndex) return slotPath.skip();
            let slotAttr = slotPath.node.openingElement.attributes[slotAttrIndex];
            let slotAttrName = slotAttr.value.value;
            let slotNode = slotPath.node;
            if (slotNode.openingElement.name.name === 'template') {
              slotNode = childrenToArrayExpr(slotNode.children, true);
            }
            slots.push(t.objectProperty(t.identifier(slotAttrName), slotNode));
            slotPath.node.openingElement.attributes.splice(slotAttrIndex, 1);
            if (slotAttrName !== 'default') slotPath.remove();
          }
        });
        if (slots.length) {
          path.node.openingElement.attributes.push(t.JSXAttribute(
            t.jSXIdentifier('$slots'),
            t.JSXExpressionContainer(t.objectExpression(slots))
          ));
        }
      }
    }
  };
};
