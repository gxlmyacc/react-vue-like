
const {
  DirectiveName,
  childrenToArrayExpr,
  isReactVueLike,
  expr2var
} = require('../utils');
const { compRegx } = require('../options');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

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
    pre(state) {
      this.handled = [];
    },
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        let tagName = openingElement.name.name;
        if (tagName === DirectiveName) {
          tagName = expr2var(openingElement.attributes.find(attr => attr.name && attr.name.name === '_source'));
        }
        if (!compRegx.test(tagName)) return;
        if (openingElement.attributes.find(attr => attr.name && attr.name.name === '$slots')) return;
        let slots = [];
        for (let slotIndex = path.node.children.length - 1; slotIndex > -1; slotIndex--) {
          let slotNode = path.node.children[slotIndex];
          if (!t.isJSXElement(slotNode)) continue;
          let openingElement = slotNode.openingElement;
          let slotAttrIndex = openingElement.attributes.findIndex(a => a.name && (a.name.namespace
            ? a.name.namespace.name === 'v-slot'
            : a.name.name === 'slot'));
          let slotAttr; let slotAttrName;
          if (~slotAttrIndex) {
            slotAttr = openingElement.attributes[slotAttrIndex];
            slotAttrName = slotAttr.name.namespace ? slotAttr.name.name.name : slotAttr.value.value;
          }
          if (openingElement.name.name === 'template') {
            path.node.children[slotIndex] = slotNode = childrenToArrayExpr(slotNode.children, true);
          }
          if (~slotAttrIndex) {
            slots.push(t.objectProperty(t.identifier(slotAttrName), slotNode));
            openingElement.attributes.splice(slotAttrIndex, 1);
            if (slotAttrName !== 'default') path.node.children.splice(slotIndex, 1);
          }
        }
        if (slots.length) {
          openingElement.attributes.push(t.JSXAttribute(
            t.jSXIdentifier('$slots'),
            t.JSXExpressionContainer(t.objectExpression(slots))
          ));
        }
      }
    }
  };
};
