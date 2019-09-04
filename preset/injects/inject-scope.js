const hash = require('hash-sum');
const options = require('../options');

module.exports = function ({ types: t, template }) {
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
            regx: options.inject.scopeRegx
          };
          path.traverse({
            ImportDeclaration(path) {
              const source = path.node.source.value;
              const matched = source.match(this.regx);
              if (!matched) return;
              this.scopeId = `data-v-${hash(filename.replace(/\\/g, '/') + source)}`;
              path.node.source.value = source.replace(this.regx, `$1?react-vue-like&scoped=true&id=${this.scopeId}`);
            },
            ClassDeclaration(path) {
              if (!this.scopeId) return path.stop();
              if (path.node.superClass && path.node.superClass.name === 'ReactVueLike') {
                path.insertAfter(template(`${path.node.id.name}.__scopeId = $SCOPEID$;`)({
                  $SCOPEID$: t.stringLiteral(this.scopeId)
                }));
              }
            },
            ClassMethod(path) {
              if (!this.scopeId) return path.stop();
              path.traverse({
                JSXElement(path) {
                  const classAttr = path.node.openingElement.attributes.find(attr => attr.name.name === 'className');
                  if (classAttr) {
                    if (t.isStringLiteral(classAttr.value)) {
                      classAttr.value = t.stringLiteral(`${this.scopeId} ${classAttr.value.value}`);
                    } else if (t.isJSXExpressionContainer(classAttr.value)) {
                      classAttr.value.expression = template("$SCOPEID$ + ' ' + ($SOURCE$)")({
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
              }, this);
            }
          }, ctx);
        }
      }
    }
  };
};
