
const {
  importSpecifier, parseDirective, directiveRegx, escapeRegx,
  getAttrASTAndIndexByName, removeAttrASTByIndex, expr2var
} = require('../utils');
const options = require('../options');

const ObserverName = 'Observer';

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx(escapeRegx(options.attrName.observer));

  function JSXElementVisitor(path) {
    const binding = getAttrASTAndIndexByName(path.node, attrName);
    if (!binding) return;

    const parsed = parseDirective(expr2var(binding.attr.name), attrName);
    if (!parsed) return;

    removeAttrASTByIndex(path.node, binding.index);

    this.hasObserver = true;

    const expr = t.jSXExpressionContainer(
      template('() => $1')({
        $1: path.node
      }).expression
    );

    const useRender = Boolean(parsed.modifiers.render);

    path.replaceWith(t.jSXElement(
      t.jSXOpeningElement(
        t.jSXIdentifier(ObserverName),
        useRender
          ? [t.jsxAttribute(t.jSXIdentifier('render'), expr)]
          : [],
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
