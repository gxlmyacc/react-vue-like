
const {
  importSpecifier, parseDirective, directiveRegx, escapeRegx,
  getAttrASTAndIndexByName, removeAttrASTByIndex, expr2var,
  ObserverName, mergeFns
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx(escapeRegx(options.attrName.observer));

  function JSXElementVisitor(path) {
    const binding = getAttrASTAndIndexByName(path.node, attrName);
    if (!binding) return;

    const parsed = parseDirective(expr2var(binding.attr.name), attrName);
    if (!parsed) return;

    removeAttrASTByIndex(path.node, binding.index);

    const slot = getAttrASTAndIndexByName(path.node, 'slot');
    const key = getAttrASTAndIndexByName(path.node, 'key');
    this.hasObserver = true;

    let renderFn = template('() => $1')({
      $1: path.node
    }).expression;

    if (binding.attr.value
      && t.isJSXExpressionContainer(binding.attr.value)
      && t.isArrowFunctionExpression(binding.attr.value.expression)) {
      renderFn = mergeFns(binding.attr.value.expression, renderFn);
    }

    const expr = t.jSXExpressionContainer(renderFn);

    const useRender = Boolean(parsed.modifiers.render);

    const observerAttrs = [];
    if (useRender) observerAttrs.push(t.jsxAttribute(t.jSXIdentifier('render'), expr));
    if (slot) {
      observerAttrs.push(t.jsxAttribute(t.jSXIdentifier('slot'), slot.attr.value));
      removeAttrASTByIndex(path.node, slot.index);
    }
    if (key) {
      observerAttrs.push(t.jsxAttribute(t.jSXIdentifier('key'), key.attr.value));
      removeAttrASTByIndex(path.node, key.index);
    }

    path.replaceWith(t.jSXElement(
      t.jSXOpeningElement(
        t.jSXIdentifier(ObserverName),
        observerAttrs,
        useRender
      ),
      useRender ? null : t.jsxClosingElement(t.jSXIdentifier(ObserverName)),
      useRender ? [] : [expr],
      true
    ));
  }
  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {
            hasObserver: false,
          };
          path.traverse({
            JSXElement: JSXElementVisitor
          }, ctx);

          if (ctx.hasObserver) importSpecifier(path, ObserverName);
        }
      }
    }
  };
};
