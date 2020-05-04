
const {
  DirectiveName,
  childrenToArrayExpr,
  isObserverClass,
  expr2var,
  expr2str
} = require('../utils');
const { compRegx } = require('../options');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    if (!isObserverClass(path)) return;

    path.traverse({
      ClassMethod(path) {
        const node = path.node;
        if (node.kind !== 'method') return;

        path.traverse({
          JSXElement(compPath) {
            const tagName = expr2str(compPath.node.openingElement.name);
            if (tagName !== 'slot') return;
            if (compPath.node.openingElement.attributes.some(attr => attr.name && attr.name.name === '$slotFn')) return;
            compPath.node.openingElement.attributes.push(t.jsxAttribute(
              t.jSXIdentifier('$slotFn'),
              t.jsxExpressionContainer(
                template('$THIS$._s')({
                  $THIS$: t.thisExpression(),
                }).expression
              )
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
        let tagName = expr2str(openingElement.name);
        if (tagName === DirectiveName) {
          let tag = openingElement.attributes.find(attr => attr.name && attr.name.name === '_source');
          tagName = tag && expr2var(tag.value);
        }
        if (!compRegx.test(tagName)) return;
        if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$slots')) return;
        let slots = [];
        for (let slotIndex = path.node.children.length - 1; slotIndex > -1; slotIndex--) {
          let child = path.node.children[slotIndex];
          let slotNode = child;
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
