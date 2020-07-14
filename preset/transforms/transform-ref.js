const { 
  isVuelikeClasses, 
  directiveRegx, 
  parseDirective, 
  memberExpr2Str, 
  expr2str,
  findAllClassAllMethods,
  // isVuelikeClassHoc
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  const attrName = directiveRegx('ref');
  const forRegx = options.forRegx;

  function JSXAttributeVisitor(path) {
    if (!path.node.name
      || !t.isStringLiteral(path.node.value)) return;

    const parsed = parseDirective(expr2str(path.node.name), attrName);
    if (!parsed) return;

    if (path.node.name.namespace) path.node.name = t.jsxIdentifier(parsed.name);
    else if (path.node.name.name !== parsed.name) path.node.name = t.jsxIdentifier(parsed.name);

    const ref = path.node.value;
    const useKey = parsed.arg || parsed.modifiers.key;

    const funcParent = path.getFunctionParent();
    const isInFor = funcParent && funcParent.parentKey === 'arguments'
      && t.isCallExpression(funcParent.parent)
      && t.isMemberExpression(funcParent.parent.callee)
      && forRegx.test(memberExpr2Str(funcParent.parent.callee));
    let key;
    if (isInFor) {
      let keyName = typeof useKey == 'string' ? useKey : 'key';
      const keyAttr = useKey && path.parent.attributes.find(attr => attr.name && attr.name.name === keyName);
      if (useKey && keyAttr) {
        key = keyAttr.value;
        if (t.isJSXExpressionContainer(key)) key = key.expression;
        key = t.callExpression(t.identifier('String'), [key]);
      } else {
        let funcParams = funcParent.node.params;
        if (funcParams.length < 2) {
          if (!funcParams.length) funcParams.push(t.identifier('_v'));
          funcParams.push(t.identifier('$index'));
        }
        key = funcParams[1];
      }
    }

    path.node.value = t.jsxExpressionContainer(template('el => $1._r($2, el, $3)')({
      $1: t.thisExpression(),
      $2: ref,
      $3: key || t.identifier('undefined')
    }).expression);
  }
  return {
    visitor: {
      Program: {
        enter(path) {
          let classes = findAllClassAllMethods(path, { staticVars: ['methods', 'computed', 'watch'] });
          classes.forEach(({ classPath, methods }) => {
            if (!isVuelikeClasses(classPath) /* && !isVuelikeClassHoc(classPath, options.vuelikePath) */) return;
            methods.forEach(methodPath => {
              methodPath.traverse({
                JSXAttribute: JSXAttributeVisitor
              });
            });
          });
        },
      },
    }
  };
};
