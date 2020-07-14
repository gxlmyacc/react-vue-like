const hash = require('hash-sum');
const options = require('../options');
const {
  ScopeName, SlotComponentName,
  expr2str, isFunction, ObserverName, ObserverTagName, LibraryVarName,
  // isVuelikeClasses, 
  // findClassVarName
} = require('../utils');

function createScopeId(filename) {
  if (options.pkg) filename = `${options.pkg.name}!${filename}`;
  return `v-${hash(filename.replace(/\\/g, '/'))}`;
}

const excluedTags = ['template', 'slot', SlotComponentName, ObserverName, ObserverTagName];

module.exports = function ({ types: t, template }) {
  const scopeAttrs = options.inject.scopeAttrs;
  const scopeFn = isFunction(options.inject.scope) ? options.inject.scope : null;
  const CLASSNAMES = `${LibraryVarName}._cn`;
  // const useCollect = options.useCollect;
  return {
    visitor: {
      Program: {
        enter(path,
          {
            file: {
              opts: { filename }
            },
          }) {
          const ctx = {
            scopeId: '',
            filename,
            regx: options.inject.scopeRegx,
            handled: []
          };

          // function ClassVisitor(path) {
          //   if (this.handled.includes(path.node)) return;
          //   this.handled.push(path.node);

          //   if (!this.scopeId) return path.stop();
          //   if (!isVuelikeClasses(path)) return path.skip();

          //   const varName = findClassVarName(path);
          //   let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
          //   parentPath.insertAfter(template(`${varName}.__scopeId = $SCOPEID$;`)({
          //     $SCOPEID$: t.stringLiteral(this.scopeId)
          //   }));
          // }

          path.traverse({
            ImportDeclaration(path) {
              const source = path.node.source.value;
              const [matched, , scoped] = source.match(this.regx) || [];
              if (!matched) return;
              if (scoped !== '?scoped') {
                if (scopeFn) {
                  let file = source.replace(this.regx, (match, p1) => scopeFn(p1, '', { filename, scopeId: '' }));
                  if (file) path.node.source.value = file;
                }
                return;
              }

              this.scopeId = createScopeId(filename);
              let file = source.replace(this.regx, (match, p1) => {
                const p2 = `?${ScopeName}&scoped=true&id=${this.scopeId}`;
                if (!scopeFn) return p1 + p2;
                return scopeFn(p1, p2, { filename, scopeId: this.scopeId });
              });
              if (file) path.node.source.value = file;
            },
            // ClassDeclaration: ClassVisitor,
            // ClassExpression: ClassVisitor
          }, ctx);

          if (scopeAttrs && ctx.scopeId) {
            path.traverse({
              JSXElement(path) {
                let tagName = expr2str(path.node.openingElement.name);
                if (!tagName || excluedTags.includes(tagName)) return;

                const classAttr = path.node.openingElement.attributes.find(attr => attr.name && expr2str(attr.name) === 'className');
                if (classAttr) {
                  if (t.isStringLiteral(classAttr.value)) {
                    classAttr.value = t.stringLiteral(`${this.scopeId} ${classAttr.value.value}`);
                  } else if (t.isJSXExpressionContainer(classAttr.value)) {
                    let expr = classAttr.value.expression;
                    let updator = v => classAttr.value.expression = v;
                    if (t.isCallExpression(expr)  
                      && expr2str(expr.callee) === CLASSNAMES) {
                      expr = classAttr.value.expression.arguments[0];
                      updator = v => classAttr.value.expression.arguments[0] = v;
                    }
                    updator(template('[$SCOPEID$,$SOURCE$]')({
                      $SCOPEID$: t.stringLiteral(this.scopeId),
                      $SOURCE$: expr
                    }).expression);
                  }
                } else {
                  path.get('openingElement').unshiftContainer('attributes', t.JSXAttribute(
                    t.JSXIdentifier('className'), t.stringLiteral(this.scopeId)
                  ));
                }
              }
            }, ctx);
          }
        }
      }
    }
  };
};
