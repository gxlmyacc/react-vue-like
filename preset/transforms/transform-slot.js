
const {
  DirectiveName,
  childrenToArrayExpr,
  isVuelikeClasses,
  // isVuelikeClassHoc,
  expr2str,
  LibraryVarName,
  SlotComponentName,
  importSpecifier
} = require('../utils');
// const options = require('../options');
const { compRegx } = require('../options');

module.exports = function ({ types: t, template }) {
  function ClassVisitor(path) {
    if (this.handled.includes(path.node)) return;
    this.handled.push(path.node);

    if (!isVuelikeClasses(path)/* && !isVuelikeClassHoc(classPath, options.vuelikePath) */) return;

    path.traverse({
      ClassMethod(path) {
        const node = path.node;
        if (node.kind !== 'method') return;

        path.traverse({
          JSXElement(compPath) {
            const tagName = expr2str(compPath.node.openingElement.name);
            if (tagName !== 'slot') return;

            if (!this.importSlotComponent) {
              importSpecifier(path, SlotComponentName);
              this.importSlotComponent = true;
            }

            const elementName = t.jsxMemberExpression(t.jsxIdentifier(LibraryVarName), t.jsxIdentifier(SlotComponentName));
            compPath.node.openingElement.name = elementName;
            if (compPath.node.closingElement) compPath.node.closingElement.name = elementName;

            // if (compPath.node.openingElement.attributes.some(attr => attr.name && attr.name.name === '$context')) return;
            compPath.node.openingElement.attributes.push(t.jsxAttribute(
              t.jSXIdentifier('$context'),
              t.jsxExpressionContainer(t.thisExpression())
            ));
            return path.skip();
          }
        }, this);
      }
    }, this);
  }
  return {
    pre(state) {
      this.handled = [];
      this.importSlotComponent = false;
    },
    visitor: {
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        let tagName = expr2str(openingElement.name);
        if (tagName === DirectiveName) {
          let tag = openingElement.attributes.find(attr => attr.name && attr.name.name === '_source');
          tagName = tag && expr2str(tag.value);
        }
        if (!compRegx.test(tagName)) return;
        if (openingElement.attributes.some(attr => attr.name && attr.name.name === '$slots')) return;
        let slots = [];
        for (let slotIndex = path.node.children.length - 1; slotIndex > -1; slotIndex--) {
          let child = path.node.children[slotIndex];
          let slotNode = child;
          if (!t.isJSXElement(slotNode)) continue;
          let openingElement = slotNode.openingElement;
          let openingElementName = expr2str(openingElement.name);
          let slotAttrIndex = openingElement.attributes.findIndex(a => a.name && (a.name.namespace
            ? a.name.namespace.name === 'v-slot'
            : a.name.name === 'slot'));
          let slotAttr; let slotAttrName;
          if (~slotAttrIndex) {
            slotAttr = openingElement.attributes[slotAttrIndex];
            slotAttrName = slotAttr.name.namespace ? slotAttr.name.name.name : slotAttr.value.value;
          }
          if (openingElementName === 'template') {
            path.node.children[slotIndex] = slotNode = childrenToArrayExpr(slotNode.children, true);
          }
          if (~slotAttrIndex) {
            openingElement.attributes.splice(slotAttrIndex, 1);
            if (slotAttrName !== 'default') {
              slots.push({ name: slotAttrName, node: slotNode });
              path.node.children.splice(slotIndex, 1);
            }
          }
        }
        if (slots.length) {
          slots.forEach(({ name, node }) => {
            openingElement.attributes.push(t.JSXAttribute(
              t.jSXIdentifier(name),
              t.JSXExpressionContainer(node)
            ));
          });
          // openingElement.attributes.push(t.JSXAttribute(
          //   t.jSXIdentifier('$slots'),
          //   t.JSXExpressionContainer(t.arrayExpression(slots.map(({ name }) => t.stringLiteral(name))))
          // ));
        }
      }
    },
  };
};
