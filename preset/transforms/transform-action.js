const { 
  LibraryName, LibraryVarName, ObserverTagName,
  expr2str, 
  isVuelikeClasses,
  // isVuelikeClassHoc,
  findClassVarName,
  findClassAllMethods,
  importDefaultSpecifier
} = require('../utils');
// const options = require('../options');

const COMP_METHS = [
  'constructor',
  'data',
  'provide',
  'render',
  'renderError',
];

module.exports = function ({ types: t, template }) {
  const flowExpr = template(`${LibraryVarName}.flow`)().expression;
  // const actionExpr = template(`${LibraryVarName}.action`)().expression;

  function asyncToGen(asyncPath) {
    let node = asyncPath.node;
    if (!node.async) return;
    node.async = false;
    node.generator = true;
    asyncPath.traverse({
      AwaitExpression(awaitPath) {
        let parent = awaitPath.getFunctionParent();
        if (parent !== asyncPath) return;
        awaitPath.replaceWith(t.yieldExpression(awaitPath.node.argument));
      }
    });
    if (t.isArrowFunctionExpression(node)) {
      node = t.functionExpression(
        null,
        asyncPath.node.params,
        asyncPath.node.body,
        asyncPath.node.generator,
        asyncPath.node.async,
      );
      asyncPath.replaceWith(template('$1.bind(this)')({ $1: node }).expression);
    }
  }

  function isClassMember(path) {
    if (!t.isMemberExpression(path.node)) return;
    if (t.isThisExpression(path.node.object)) return true;
    if (t.isMemberExpression(path.node.object)) return isClassMember(path.get('object'));
    const object = path.get('object');
    let name = expr2str(object.node);
    let binding = object.scope.bindings[name];
    let funcParent = path.getFunctionParent();
    while (!binding && funcParent) {
      binding = funcParent.scope.bindings[name];
      funcParent = binding ? null : funcParent.getFunctionParent();
    }
    if (!binding) return;
    switch (binding.path.type) {
      case 'VariableDeclarator': return isClassMember(binding.path.get('init'));
      case 'Identifier':
        if (binding.kind === 'param') return true;
        return false;
      default: //
    }
    if (binding.constantViolations.length) return binding.constantViolations.some(c => {
      if (c.type === 'AssignmentExpression') return isClassMember(c.get('right'));
    });
  }

  function hasAssgin(exprPath) {
    let ret = false;
    exprPath.traverse({
      AssignmentExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!isClassMember(path.get('left'))) return;
        ret = true;
        path.stop();
      },
      CallExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!t.isMemberExpression(path.node.callee)) return;
        let calleeStr = expr2str(path.node.callee);
        if (calleeStr === 'Object.assign') {
          ret = isClassMember(path.get('arguments.0'));
          return path.stop();
        }
        if (/\.(push|remove|pop|unshift|splice)$/.test(calleeStr)) {
          ret = true;
          return path.stop();
        }
      },
      UpdateExpression(path) {
        if (path.getFunctionParent() !== exprPath) return;
        if (!isClassMember(path.get('argument'))) return;
        ret = true;
        path.stop();
      }
    });
    return ret;
  }

  let handled = [];
  function FunctionExprVisitor(onFind, useLibVar) {
    return function (exprPath) {
      let expression = exprPath.node;
      if (handled.includes(expression)) return;
      handled.push(expression);
  
      if (!hasAssgin(exprPath)) return;

      if (t.isCallExpression(exprPath.parent)
        && /\.(flow|action|runAction|_a)$/.test(expr2str(exprPath.parent.callee))) return;
  
      if (expression.async) {
        asyncToGen(exprPath);
        onFind && onFind.call(this);
        exprPath.replaceWith(template(`${LibraryVarName}.flow($1)`)({ $1: exprPath.node }).expression);
        return;
      }
  
      onFind && onFind.call(this);
      exprPath.replaceWith(template('$THIS$._a($HANDER$)')({
        $THIS$: useLibVar ? t.identifier(LibraryVarName) : t.thisExpression(),
        $HANDER$: expression,
      }).expression);
    };
  }

  function ClassVisitor(path) {
    if (handled.includes(path.node)) return;
    handled.push(path.node);
    

    if (!isVuelikeClasses(path)/* && !isVuelikeClassHoc(path, options.vuelikePath) */) return;
    
    let flows = [];
    let varName = findClassVarName(path);
    let allMethods = findClassAllMethods(path, { staticVars: ['methods'] });

    allMethods.forEach(path => {
      path.traverse({
        ArrowFunctionExpression: FunctionExprVisitor(),
        // FunctionExpression: FunctionExprVisitor(),
      });

      if (COMP_METHS.includes(expr2str(path.node.key))) return;

      // if (!path.node.decorators) path.node.decorators = [];
      if (!path.node.static && path.node.async) {
        asyncToGen(path);
        flows.push(t.stringLiteral(expr2str(path.node.key)));
        // path.node.decorators.push(t.decorator(flowExpr));
      }
      // else path.node.decorators.push(t.decorator(actionExpr));
    });
    if (flows.length && varName) {
      let parentPath = t.isProgram(path.parentPath.node) ? path : path.parentPath;
      parentPath.insertAfter(template(`${varName}.__flows = $1;`)({
        $1: t.arrayExpression(flows)
      }));
    }
  }

  return {
    pre(state) {
      handled = [];
    },
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXElement(path) {
              if (!t.isJSXIdentifier(path.node.openingElement.name)
                || expr2str(path.node.openingElement.name) !== ObserverTagName) return;

              if (handled.includes(path.node)) return path.skip();
              handled.push(path.node);
      
              const ctx = {};
              
              path.traverse({
                ArrowFunctionExpression: FunctionExprVisitor(() => {
                  if (!ctx.isLibImported) {
                    importDefaultSpecifier(path, LibraryVarName);
                    ctx.isLibImported = true;
                  }
                }, true),
              });

              path.skip();
            },
          });
        }
      },
      ClassDeclaration: ClassVisitor,
      ClassExpression: ClassVisitor,

      CallExpression(path) {
        if (handled.includes(path.node)) return path.skip();
        handled.push(path.node);

        const arg1 = path.node.arguments[0];
        if (!arg1 || (!t.isFunctionExpression(arg1)
          && !t.isArrowFunctionExpression(arg1))
          || !arg1.async) return;

        const callee = path.node.callee;
        
        if (t.isIdentifier(callee) && callee.name === 'action') {
          let a = path.scope.bindings.action;
          if (!a || !t.isImportDeclaration(a.path.parent)
            || a.path.parent.source.value !== LibraryName) return;
          callee.name = 'flow';
        } else if (t.isMemberExpression(callee)) {
          const calleeName = expr2str(callee);
          if (`${LibraryVarName}.action` === calleeName) {
            callee.property.name = 'flow';
          } else if (`${LibraryVarName}.runAction` === calleeName) {
            let arg1Name = expr2str(arg1);
            if (arg1Name === `${LibraryVarName}.flow`) return;
            let argPath = path.get('arguments.0');
            asyncToGen(argPath);
            argPath.replaceWith(t.callExpression(flowExpr, [...path.node.arguments]));
            // path.node.arguments.splice(0, 1, );
          }
        }
      }
    }
  };
};
