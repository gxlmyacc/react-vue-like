
const camelCase = require('camelcase');
const { LibraryName, LibraryVarName, appendAttrEvent, mergeAttrEvent, directiveRegx, parseDirective, bindModifiers, expr2var } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx('[^$|_|(v\\-)|0-9][A-Za-z0-9\\-]+');
  const keyCodes = options.keyCodes;
  const modifierCode = options.modifierCode;
  const genGuard = options.genGuard;

  function JSXAttributeVisitor(path) {
    const attr = path.node;
    if (!attr.name || !t.isJSXExpressionContainer(attr.value)) return;
    const parsed = parseDirective(expr2var(attr.name), attrName);
    if (!parsed || !Object.keys(parsed.modifiers).length) return;
    const isEvent = /^on[A-Z]/.test(parsed.name);

    if (t.isJSXNamespacedName(attr.name)) {
      attr.name = t.jsxIdentifier(parsed.name);
    } else attr.name.name = parsed.name;
    const value = attr.value.expression;

    const modifiers = parsed.modifiers;
    if (!isEvent) {
      if (modifiers.sync) {
        appendAttrEvent(path, `onChange${camelCase(parsed.name, { pascalCase: true })}`, t.arrowFunctionExpression(
          [t.identifier('v')],
          t.blockStatement([
            template(`$1=${bindModifiers('v', modifiers)}`)({ $1: value })
          ])
        ));
      }
      return;
    }

    function genFilterCode(key) {
      // eslint-disable-next-line
      let keyVal = parseInt(key, 10);
      if (keyVal) return ('$event.keyCode!==' + keyVal);
      let code = keyCodes[key];
      if (code) return ('$event.keyCode!==' + code);
      this.needImportLibrary = true;
      return (
        `${LibraryVarName}._k.call(this,$event.keyCode,${JSON.stringify(key)},{},$event.key)`
      );
    }

    function genKeyFilter(keys) {
      return (`if(!('button' in $event)&&${(keys.map(genFilterCode.bind(this)).join('&&'))})return null;`);
    }

    // event
    let code = '';
    let genModifierCode = '';
    let keys = [];
    if (modifiers.capture) {
      attr.name.name = `${parsed.name}Capture`;
      delete modifiers.capture;
    }
    for (let key in modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) keys.push(key);
      } else if (key === 'exact') {
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ('$event.' + keyModifier + 'Key'); })
            .join('||')
        );
      } else keys.push(key);
    }
    if (keys.length) {
      code += genKeyFilter.call(this, keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    if (!code) return;
    const body = template(code)({});
    mergeAttrEvent(attr, t.arrowFunctionExpression(
      [t.identifier('$event')],
      t.blockStatement(Array.isArray(body) ? body : [body])
    ));
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          let ctx = {
            declaration: null,
            needImportLibrary: false
          };
          path.traverse({
            ImportDeclaration(path) {
              if (path.node.source.value === LibraryName) {
                this.declaration = path.node;
              }
            },
            JSXAttribute: JSXAttributeVisitor
          }, ctx);

          if (ctx.needImportLibrary) {
            if (ctx.declaration) {
              if (!ctx.declaration.specifiers.find(v => t.isImportDefaultSpecifier(v))) {
                ctx.declaration.specifiers.push(
                  t.importDefaultSpecifier(t.identifier(LibraryVarName))
                );
              }
            } else {
              path.unshiftContainer(
                'body',
                t.importDeclaration(
                  [
                    t.importDefaultSpecifier(t.identifier(LibraryVarName))
                  ],
                  t.stringLiteral(LibraryName),
                )
              );
            }
          }
        }
      }
    }
  };
};
