
const camelCase = require('camelcase');
const { appendAttrEvent, mergeAttrEvent, directiveRegx, parseDirective, bindModifiers } = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx('[^$|_|(v\\-)|0-9][A-Za-z0-9\\-]+');
  const keyCodes = options.keyCodes;
  const modifierCode = options.modifierCode;
  const genGuard = options.genGuard;

  function JSXAttributeVisitor(path) {
    const attr = path.node;
    if (!attr.name || !t.isJSXExpressionContainer(attr.value)) return;
    const parsed = parseDirective(attr.name.name, attrName);
    if (!parsed || !Object.keys(parsed.modifiers).length) return;
    const isEvent = /^on[A-Z]/.test(parsed.name);

    attr.name.name = parsed.name;
    const value = attr.value.expression;

    const modifiers = parsed.modifiers;
    if (!isEvent) {
      if (modifiers.sync) {
        appendAttrEvent(path, `onUpdate${camelCase(parsed.name, { pascalCase: true })}`, t.arrowFunctionExpression(
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
      if (keyVal) return ('e.keyCode!==' + keyVal);
      let code = keyCodes[key];
      if (code) return ('e.keyCode!==' + code);
      this.needReactVueLike = true;
      return (
        `ReactVueLike._k.call(this,e.keyCode,${JSON.stringify(key)},{},e.key)`
      );
    }

    function genKeyFilter(keys) {
      return (`if(!('button' in e)&&${(keys.map(genFilterCode.bind(this)).join('&&'))})return null;`);
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
            .map(function (keyModifier) { return ('e.' + keyModifier + 'Key'); })
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
      [t.identifier('e')],
      t.blockStatement(Array.isArray(body) ? body : [body])
    ));
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          let ctx = {
            declaration: null,
            needReactVueLike: false
          };
          path.traverse({
            ImportDeclaration(path) {
              if (path.node.source.value === 'react-vue-like') {
                this.declaration = path.node;
              }
            },
            JSXAttribute: JSXAttributeVisitor
          }, ctx);

          if (ctx.needReactVueLike) {
            if (ctx.declaration) {
              if (!ctx.declaration.specifiers.find(v => t.isImportDefaultSpecifier(v))) {
                ctx.declaration.specifiers.push(
                  t.importDefaultSpecifier(t.identifier('ReactVueLike'))
                );
              }
            } else {
              path.unshiftContainer(
                'body',
                t.importDeclaration(
                  [
                    t.importDefaultSpecifier(t.identifier('ReactVueLike'))
                  ],
                  t.stringLiteral('react-vue-like'),
                )
              );
            }
          }
        }
      }
    }
  };
};
