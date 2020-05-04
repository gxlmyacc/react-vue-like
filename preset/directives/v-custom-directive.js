const camelCase = require('camelcase');
const {
  LibraryName,
  expr2var,
  DirectiveName,
  DirectiveComponentName,
  LibraryVarName,
  iterativeAttrAST,
  var2Expression,
  removeAttrAST,
  extractNodeCode,
  parseDirective,
  importDefaultSpecifier,
  expr2str
} = require('../utils');

const options = require('../options');

module.exports = function ({ types: t, template }) {
  function JSXElementVisitor(path) {
    const prefix = options.prefix;
    const attrNameKeys = options.attrNameKeys;
    const attrName = options.directiveRegx;

    let bindings = [];

    iterativeAttrAST(path.node, attr => {
      const sourceName = expr2str(path.node.openingElement.name);
      if (sourceName === DirectiveName) return;
      let parsed = parseDirective(expr2var(attr.name), attrName);
      if (!parsed || !parsed.name) return;

      if (attrNameKeys.indexOf(`${prefix}${parsed.name}`) > -1) return;

      this.hasDirectvie = true;

      const binding = Object.assign(parsed, {
        name: camelCase(parsed.name),
        attr,
        expression: extractNodeCode(path, t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value),
      });
      bindings.push(binding);
    });

    if (!bindings.length) return;

    bindings = bindings.map(({ attr, ...binding }) => {
      binding.value = t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value;
      removeAttrAST(path.node, expr2var(attr.name));
      return binding;
    });

    const sourceName = expr2str(path.node.openingElement.name);
    const sourceNameNode = path.node.openingElement.name;
    const elementName = t.jsxMemberExpression(t.jsxIdentifier(LibraryVarName), t.jsxIdentifier(DirectiveComponentName));
    path.node.openingElement.name = elementName;
    if (path.node.closingElement) path.node.closingElement.name = elementName;
    path.node.openingElement.attributes.push(t.JSXAttribute(
      t.jSXIdentifier('_source'),
      t.JSXExpressionContainer(
        t.isJSXIdentifier(sourceNameNode) || t.isJSXNamespacedName(sourceNameNode)
          ? /^[A-Z]/.test(sourceName) ? t.identifier(sourceName) : t.stringLiteral(sourceName)
          : t.memberExpression(sourceNameNode.Object, sourceNameNode.property)
      )
    ));
    const $bindings = var2Expression(bindings);
    path.node.openingElement.attributes.push(t.JSXAttribute(
      t.jSXIdentifier('_bindings'),
      t.JSXExpressionContainer($bindings.expression)
    ));

    // const refAttr = path.node.openingElement.attributes.find(a => a.name && a.name === 'ref');
    // if (refAttr) refAttr.name.name = '$ref';
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {
            declaration: null,
            hasDirectvie: false
          };

          path.traverse({
            ImportDeclaration(path) {
              if (path.node.source.value === LibraryName) {
                this.declaration = path.node;
              }
            },
            JSXElement: JSXElementVisitor,
          }, ctx);

          if (ctx.hasDirectvie) importDefaultSpecifier(path, LibraryVarName);
        },
      },
    }
  };
};
