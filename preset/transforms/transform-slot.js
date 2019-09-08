
const {
  DirectiveName,
} = require('../utils');

module.exports = function ({ types: t, template }) {
  function childrenToArray(children, trim) {
    children = children.slice();
    for (let i = children.length - 1; i > -1; i--) {
      let c = children[i];
      if (t.isJSXText(c)) {
        if (trim && !c.value.trim()) children.splice(i, 1);
        else children[i] = t.stringLiteral(c.value);
      } else if (t.isJSXExpressionContainer(c)) children[i] = c.expression;
    }
    return children.length === 1 ? children[0] : t.arrayExpression(children);
  }


  return {
    visitor: {
      ClassDeclaration(path) {
        if (!path.node.superClass || !path.node.superClass.name === 'ReactVueLike') return;

        const ctx = {
        };

        path.traverse({
          ClassMethod(path) {
            const node = path.node;
            if (node.kind !== 'method') return;

            path.traverse({
              JSXElement(compPath) {
                const tagName = compPath.node.openingElement.name.name;
                if (tagName === 'slot') {
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
                      $CHILDREN$: childrenToArray(compPath.node.children)
                    }).expression
                  ));
                  return path.skip();
                }

                if (!/^[A-Z]/.test(tagName) || tagName === DirectiveName) return;
                if (compPath.node.openingElement.attributes.find(attr => attr.name && attr.name.name === '$slots')) return;
                let slots = [];
                compPath.traverse({
                  JSXElement(slotPath) {
                    let slotAttrIndex = slotPath.node.openingElement.attributes.findIndex(a => a.name && a.name.name === 'slot');
                    if (!~slotAttrIndex) return slotPath.skip();
                    let slotAttr = slotPath.node.openingElement.attributes[slotAttrIndex];
                    let slotAttrName = slotAttr.value.value;
                    let slotNode = slotPath.node;
                    if (slotNode.openingElement.name.name === 'template') {
                      slotNode = childrenToArray(slotNode.children, true);
                    }
                    slots.push(t.objectProperty(t.identifier(slotAttrName), slotNode));
                    slotPath.node.openingElement.attributes.splice(slotAttrIndex, 1);
                    if (slotAttrName !== 'default') slotPath.remove();
                  }
                }, this);
                if (slots.length) {
                  compPath.node.openingElement.attributes.push(t.JSXAttribute(
                    t.jSXIdentifier('$slots'),
                    t.JSXExpressionContainer(t.objectExpression(slots))
                  ));
                }
              }
            }, this);
          }
        }, ctx);
      },
    }
  };
};
