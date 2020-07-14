const {
  arr2Expression,
  memberExpr2Str,
  isVuelikeClasses,
  // isVuelikeClassHoc,
  findInstanceSpecifier,
  importDefaultSpecifier,
  findAllClassAllMethods,
  InstanceName
} = require('../utils');
const options = require('../options');

module.exports = function ({ types: t, template }) {
  function getJSXElementVisitor(useVuelikeInstance) {
    return function (path) {
      const filterTemplate = (callee, args) => {
        let method = t.isArrayExpression(args) ? 'apply' : 'call';
        return template(`$THIS$._f(() => $THIS$.$FILTERS$.${callee}.${method}(null, $ARGS$), '${callee}')`)({
          $THIS$: useVuelikeInstance ? t.identifier(InstanceName) : t.thisExpression(),
          $FILTERS$: useVuelikeInstance ? t.identifier('filters') : t.identifier('$filters'),
          $ARGS$: args
        });
      };

      path.traverse({
        JSXExpressionContainer(path) {
          if (path.parent.type !== 'JSXElement') return;
          const { expression } = path.node;
          if (expression.type !== 'BinaryExpression' && expression.operator !== '|') return;
  
          if (!this.hasFilter) this.hasFilter = true;

          if (useVuelikeInstance && !this.instanceSpecifier) {
            this.instanceSpecifier = importDefaultSpecifier(path, InstanceName, options.vuelikePath);
          }
      
          let { left, right } = expression;
  
          let newExpr;
          if (t.isStringLiteral(right)) {
            // if (right.value.test(/^[a-z_][a-z0-9_]*\(.*\)$/i)) right = template(right.name)().expression;
            // else right = t.identifier(right.value);
            newExpr = filterTemplate(right.value, left);
          } else if (t.isIdentifier(right)) {
            newExpr = filterTemplate(right.name, left);
          } else if (t.isMemberExpression(right)) {
            let property = right;
            while (property.object) property = property.object;
            let args = [left];
            if (property.arguments) args.push(...property.arguments);
            let callee = memberExpr2Str(right);
            newExpr = filterTemplate(callee, arr2Expression(args).expression);
          } else if (t.isCallExpression(right)) {
            let callee = t.isMemberExpression(right.callee)
              ? memberExpr2Str(right.callee)
              : (right.callee.name || right.callee.value);
            newExpr = filterTemplate(callee, arr2Expression([left, ...right.arguments]).expression);
          }
  
          if (newExpr) path.node.expression = newExpr.expression;
        }
      }, this);
    };
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          const ctx = {
            hasFilter: false,
            instanceSpecifier: findInstanceSpecifier(path, options.vuelikePath),
          };

          let classes = findAllClassAllMethods(path, { staticVars: ['methods', 'computed', 'watch', 'data'] });
          classes.forEach(({ classPath, methods }) => {
            if (!isVuelikeClasses(classPath)/* && !isVuelikeClassHoc(classPath, options.vuelikePath) */) return;
            methods.forEach(methodPath => {
              methodPath.traverse({
                JSXElement: getJSXElementVisitor(false)
              }, ctx);
            });
          });


          path.traverse({
            JSXElement: getJSXElementVisitor(true)
          }, ctx);
        },
      },
    }
  };
};
