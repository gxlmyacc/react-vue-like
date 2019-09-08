const {
  DirectiveName,
  iterativeAttrAST,
  var2Expression,
  removeAttrAST,
  extractNodeCode
} = require('../utils');

const options = require('../options');

module.exports = function ({ types: t, template }) {
  function JSXElementVisitor(path) {
    const prefix = options.prefix;
    const attrNameKeys = options.attrNameKeys;
    const attrName = new RegExp(`^${prefix}([a-z0-9-]+)(?:_([a-z0-9-]+))?((?:\\$[a-z0-9-]+)*)$`, 'i');

    let bindings = [];

    iterativeAttrAST(path.node, attr => {
      if (path.node.openingElement.name.name === DirectiveName) return;
      const matched = attr.name.name.match(attrName);
      if (!matched) return;
      let [, name, arg, modifiers] = matched;

      if (attrNameKeys.indexOf(`${prefix}${name}`) > -1) return;

      this.hasDirectvie = true;

      const binding = {
        attr,
        name,
        arg: arg || '',
        modifiers: {},
        expression: extractNodeCode(path, attr.value.expression),
      };

      if (modifiers) {
        modifiers = modifiers.split('$').filter(Boolean).forEach(key => binding.modifiers[key] = true);
      }
      bindings.push(binding);
    });

    if (!bindings.length) return;

    bindings = bindings.map(({ attr, ...binding }) => {
      binding.value = attr.value.expression;
      removeAttrAST(path.node, attr.name.name);
      return binding;
    });

    const sourceName = path.node.openingElement.name.name;
    path.node.openingElement.name.name = DirectiveName;
    if (path.node.closingElement) path.node.closingElement.name.name = DirectiveName;
    path.node.openingElement.attributes.push(t.JSXAttribute(
      t.jSXIdentifier('_source'),
      t.JSXExpressionContainer(/^[A-Z]/.test(sourceName) ? t.identifier(sourceName) : t.stringLiteral(sourceName))
    ));
    const $bindings = var2Expression(bindings);
    path.node.openingElement.attributes.push(t.JSXAttribute(
      t.jSXIdentifier('_bindings'),
      t.JSXExpressionContainer($bindings.expression)
    ));
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
              if (path.node.source.value === 'react-vue-like') {
                this.declaration = path.node;
              }
            },
            JSXElement: JSXElementVisitor,
          }, ctx);

          if (ctx.hasDirectvie) {
            if (ctx.declaration) {
              if (!ctx.declaration.specifiers.find(v => v.local.name === DirectiveName)) {
                ctx.declaration.specifiers.push(
                  t.importSpecifier(t.identifier(DirectiveName), t.identifier(DirectiveName))
                );
              }
            } else {
              path.unshiftContainer(
                'body',
                t.importDeclaration(
                  [
                    t.importSpecifier(t.identifier(DirectiveName), t.identifier(DirectiveName))
                  ],
                  t.stringLiteral('react-vue-like'),
                )
              );
            }
          }
        },
      },
    }
  };
};
