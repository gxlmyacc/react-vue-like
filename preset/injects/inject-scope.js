const hash = require('hash-sum');
const options = require('../options');
const {
  isReactVueLike, expr2var, isFunction, ObserverName, DirectiveName,
  /* findClassVarName */
} = require('../utils');

function createScopeId(filename) {
  if (options.pkg) filename = `${options.pkg.name}!${filename}`;
  return `v-${hash(filename.replace(/\\/g, '/'))}`;
}

const excluedTags = ['template', 'slot', ObserverName, DirectiveName];

module.exports = function ({ types: t, template }) {
  const scopeAttrs = options.inject.scopeAttrs;
  const scopeFn = isFunction(options.inject.scope) ? options.inject.scope : (p1, p2) => p1 + p2;
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

          function ClassVisitor(path) {
            if (this.handled.includes(path.node)) return;
            this.handled.push(path.node);

            if (!this.scopeId) return path.stop();
            if (!isReactVueLike(path)) return path.skip();

            // if (useCollect) {
            //   const varName = findClassVarName(path);
            //   let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
            //   parentPath.insertAfter(template(`${varName}.__scopeId = $SCOPEID$;`)({
            //     $SCOPEID$: t.stringLiteral(this.scopeId)
            //   }));
            // }
          }

          path.traverse({
            ImportDeclaration(path) {
              const source = path.node.source.value;
              const matched = source.match(this.regx);
              if (!matched) return;
              this.scopeId = createScopeId(filename);
              let file = source.replace(this.regx, (match, p1) => scopeFn(p1, `?react-vue-like&scoped=true&id=${this.scopeId}`, {
                filename,
                scopeId: this.scopeId
              }));
              if (file) path.node.source.value = file;
            },
            ClassDeclaration: ClassVisitor,
            ClassExpression: ClassVisitor
          }, ctx);

          if (scopeAttrs && ctx.scopeId) {
            path.traverse({
              JSXElement(path) {
                let tagName = expr2var(path.node.openingElement.name);
                if (!tagName || excluedTags.includes(tagName)) return;

                const classAttr = path.node.openingElement.attributes.find(attr => attr.name && expr2var(attr.name) === 'className');
                if (classAttr) {
                  if (t.isStringLiteral(classAttr.value)) {
                    classAttr.value = t.stringLiteral(`${this.scopeId} ${classAttr.value.value}`);
                  } else if (t.isJSXExpressionContainer(classAttr.value)) {
                    classAttr.value.expression = template('[$SCOPEID$,$SOURCE$]')({
                      $SCOPEID$: t.stringLiteral(this.scopeId),
                      $SOURCE$: classAttr.value.expression
                    }).expression;
                  }
                } else {
                  path.get('openingElement').pushContainer('attributes', t.JSXAttribute(
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
