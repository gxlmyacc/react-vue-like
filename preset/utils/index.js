
const t = require('@babel/types');
const template = require('@babel/template').default;
const fs = require('fs');
const findUp = require('find-up');
const path = require('path');
const types = require('./types');

const LibraryVarName = 'ReactVueLike';
const DirectiveComponentName = 'Directive';
const DirectiveName =  `${LibraryVarName}.${DirectiveComponentName}`;
const SlotComponentName = 'Slot';
const ComponentName = `${LibraryVarName}.Component`;
const ObserverName = 'Observer';
const ObserverTagName = 'observer';
const LibraryName = 'react-vue-like';
const ComponentFlagPrefix = '__vuelike';
const DecoratorName = 'withVuelike';
const LibraryDecoratorName = 'vuelikeInject';
const ScopeName = 'vuelike';
const InstanceName = 'vuelike';

if (!Date.prototype.format) {
  Date.prototype.format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    Object.keys(o).forEach(k => {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    });
    return fmt;
  };
}

function objValueStr2AST(objValueStr, t) {
  const values = objValueStr.split('.');
  if (values.length === 1) return values[0] === 'this' ? t.ThisExpression() : t.identifier(values[0]);
  return t.memberExpression(
    objValueStr2AST(values.slice(0, values.length - 1).join('.'), t),
    objValueStr2AST(values[values.length - 1], t)
  );
}

function objPropStr2AST(key, value, t) {
  key = key.split('.');
  return t.objectProperty(
    t.identifier(key[0]),
    key2ObjCall(key, value, t)
  );

  function key2ObjCall(key, value, t, index) {
    !index && (index = 0);
    if (key.length - 1 <= index) return objValueStr2AST(value, t);
    return t.callExpression(
      t.memberExpression(
        t.identifier('Object'),
        t.identifier('assign')
      ),
      [
        t.objectExpression([]),
        objValueStr2AST(indexKey2Str(index + 1, key), t),
        t.objectExpression([
          t.objectProperty(
            t.identifier(key[index + 1]),
            key2ObjCall(key, t, index + 1)
          )
        ])
      ]
    );

    function indexKey2Str(index, key) {
      const str = ['_state'];
      for (let i = 0; i < index; i++) str.push(key[i]);
      return str.join('.');
    }
  }
}
function var2Expression(v, parent) {
  if (t.isNode(v)) return v;
  if (v === undefined) return;
  if (Array.isArray(v)) return arr2Expression(v, parent);
  switch (typeof v) {
    case 'string': return t.stringLiteral(v);
    case 'boolean': return t.booleanLiteral(v);
    case 'number': return t.numericLiteral(v);
    case 'object':
      if (v === null) return t.nullLiteral();
      if (v instanceof RegExp) return t.regExpLiteral(v.source, v.flags);
      if (v instanceof Date) return template('new Date(TIME)')({ TIME: t.numericLiteral(v.getTime()) });
      if (v instanceof Function) return template(v.toString())();
      return obj2Expression(v, parent);
    default: return t.identifier('undefined');
  }
}

function arr2Expression(arr, parent) {
  let temp = '';
  let vars = {};
  arr.forEach((v, i) => {
    let expr = var2Expression(v, arr);
    if (!expr) return;
    let key = `$${i}`;
    temp += (temp ? ', ' : '') + key;
    vars[key] = expr;
  });
  return template(`[${temp}]`)(vars);
}

function obj2Expression(obj, parent) {
  let props = Object.keys(obj).map(k => {
    let v = obj[k];
    let expr = var2Expression(v, obj);
    if (!expr) return;
    return t.ObjectProperty(t.identifier(k), expr);
  }).filter(Boolean);
  return t.objectExpression(props);
}

function extractNodeCode(path, node) {
  const sources = path.hub.file.code.split('\n');
  let ret = [];
  if (node) {
    let lineStart = node.loc.start.line - 1;
    let lineIndex = lineStart;
    let lineEnd = node.loc.end.line - 1;
    if (lineStart === lineEnd) {
      ret.push(sources[lineStart].substring(node.loc.start.column, node.loc.end.column));
    } else {
      while (lineIndex < lineEnd) {
        let line = sources[lineIndex];
        if (lineIndex === lineStart) ret.push(line.substr(node.loc.start.column));
        else if (lineIndex === lineEnd) ret.push(line.substr(0, node.loc.end.column));
        else ret.push(line);
        lineIndex++;
      }
    }
  }
  return ret.join('\n');
}

function expr2var(expr) {
  if (!expr) return '';
  switch (expr.type) {
    case 'JSXExpressionContainer':
      return expr2var(expr.expression);
    case 'MemberExpression':
    case 'JSXMemberExpression':
      return memberExpr2Str(expr);
    case 'ThisExpression':
      return 'this';
    case 'Identifier':
    case 'JSXIdentifier':
      return expr.name;
    case 'JSXNamespacedName':
      return `${expr.namespace.name}:${expr.name.name}`;
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'StringLiteral':
    case 'jSXText':
      return expr.value;
    case 'NullLiteral':
      return null;
    case 'RegExpLiteral':
      return new RegExp(expr.pattern, expr.flags);
    default:
      throw new Error(`not support type: ${expr.type}!`);
  }
}

function expr2str(expr) {
  if (!expr) return '';
  if (typeof expr === 'string') return expr;
  // if (expr.extra) return expr.extra.raw;
  switch (expr.type) {
    case 'JSXExpressionContainer':
      return expr2str(expr.expression);
    case 'MemberExpression':
    case 'JSXMemberExpression':
      return memberExpr2Str(expr);
    case 'Identifier':
    case 'JSXIdentifier':
      return expr.name;
    case 'JSXNamespacedName':
      return `${expr.namespace.name}:${expr.name.name}`;
    case 'ThisExpression':
      return 'this';
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'StringLiteral':
      return expr.value;
    case 'NullLiteral':
      return 'null';
    case 'RegExpLiteral':
      return `/${expr.pattern}/${expr.flags}`;
    case 'SpreadElement':
      return `...${expr2str(expr.argument)}`;
    case 'BinaryExpression':
      return `${expr2str(expr.left)} ${expr.operator} ${expr2str(expr.right)}`;
    case 'UpdateExpression':
    case 'UnaryExpression':
      return `${expr.prefix ? expr.operator : ''}${expr2str(expr.argument)}${!expr.prefix ? expr.operator : ''}`;
    case 'ConditionalExpression':
      return `${expr2str(expr.test)} ? ${expr2str(expr.consequent)} : ${expr2str(expr.alternate)}`;
    case 'CallExpression':
      return `${expr2str(expr.callee)}(${expr.arguments.map(a => expr2str(a)).join(',')})`;
    case 'NewExpression':
      return `new ${expr2str(expr.callee)}(${expr.arguments.map(a => expr2str(a)).join(',')})`;
    case 'VariableDeclarator':
      return `${expr.id}${expr.init ? ` = ${expr2str(expr.init)}` : ''}`;
    case 'VariableDeclaration':
      return `${expr.kind} ${expr.declarations.map(d => expr2str(d))};`;
    case 'BlockStatement':
      return `{${expr2str(expr.body)}}`;
    case 'TemplateLiteral':
      return temp2var(expr);
    case 'TaggedTemplateExpression':
      return `${expr2str(expr2str(expr.tag))}${expr2str(expr.quasi)}`;
    case 'FunctionExpression':
      return `function ${expr2str(expr.id)}(${expr.params.map(a => expr2str(a)).join(',')})${expr2str(expr.body)}`;
    case 'AssignmentPattern':
      return `${expr2str(expr.left)} = ${expr2str(expr.right)}`;
    case 'ArrayExpression':
    case 'ArrayPattern':
      return `[${expr.elements.map(v => expr2str(v)).join(', ')}]`;
    case 'ObjectProperty':
      return `${expr.computed ? `[${expr2str(expr.key)}]` : expr2str(expr.key)}: ${expr2str(expr.value)}`;
    case 'ObjectMethod':
      // eslint-disable-next-line
      return `${expr.kind !== 'method' ? `${expr.kind} ` : ''}${expr2str(expr.key)}(${expr.params.map(a => expr2str(a)).join(', ')})${expr2str(expr.body)}`;
    case 'ObjectPattern':
    case 'ObjectExpression':
      return `{${expr.properties.map(v => expr2str(v)).join(', ')}}`;
    default: return '';
  }
}

function temp2var(expr) {
  let arr = [...expr.expressions, ...expr.quasis].sort((a, b) => a.start - b.start);
  let ret = '';
  arr.forEach(v => {
    if (v.type === 'TemplateElement') ret += v.value.raw;
    else ret += '${' + expr2str(v) + '}';
  });
  return '`' + ret + '`';
}

function memberExpr2Str(expr) {
  let objStr;
  const object = expr.object;
  if (!object) return String(expr.value);
  switch (expr.object.type) {
    case 'MemberExpression':
    case 'JSXMemberExpression':
      objStr = memberExpr2Str(expr.object);
      break;
    default:
      objStr = expr2str(expr.object);
  }
  let propIsMember = expr.property.type === 'MemberExpression';
  let propStr = expr2str(expr.property);
  return objStr + (objStr && !propIsMember ? '.' : '') + (propIsMember ? `[${propStr}]` : propStr);
}

function findNextNode(path, siblings, index) {
  if (!siblings) return null;

  const nextIndex = index + 1;
  const nextNode = siblings[nextIndex];
  if (!nextNode) return null;

  const { type, value } = nextNode;
  if (type === 'JSXText' && !value.trim()) return findNextNode(nextNode, siblings, nextIndex);
  return type === 'JSXElement' 
    ? { nextNode, nextIndex } 
    : null;
}

function getAttrASTAndIndexByName(node, attrName) {
  if (!node || !node.openingElement) return null;

  const { type, attributes } = node.openingElement;
  if (type !== 'JSXOpeningElement') return null;

  const isRegx = attrName instanceof RegExp;
  const index = attributes.findIndex(
    attr => attr.name && (isRegx
      ? attrName.test(expr2str(attr.name))
      : expr2str(attr.name) === attrName
    )
  );
  if (index < 0) return null;

  const attr = attributes[index];
  return {
    attr,
    index,
    node
  };
}

function iterativeAttrAST(node, callback) {
  if (!node || !node.openingElement) return;

  const { type, attributes } = node.openingElement;
  if (type !== 'JSXOpeningElement') return;

  attributes.some((attr, i) => {
    attr.name && callback(attr, i, attributes);
  });
}

function removeNode(nodes, nodeToRemoved) {
  const index = nodes.findIndex(i => i === nodeToRemoved);
  if (index >= 0) {
    nodes.splice(index, 1);
  }
}

function removeAttrAST(node, attrName) {
  const attr = getAttrASTAndIndexByName(node, attrName);
  if (attr) removeAttrASTByIndex(node, attr.index);
}

function removeAttrASTByIndex(node, index) {
  const { openingElement } = node;
  if (!openingElement) return;

  const { attributes } = openingElement;
  attributes.splice(index, 1);
}

function removeAttributeVisitor(path, attr) {
  return path.traverse({
    JSXAttribute(path) {
      path.skip();
      if (path.node === this.attr) {
        path.remove();
        path.stop();
      }
    },
  }, { attr });
}

function transformIfBinding(path, ifBinding) {
  let { attr, index, node } = ifBinding;

  removeAttrASTByIndex(node, index);

  const targetAST = t.conditionalExpression(
    attr.value.expression,
    node,
    t.nullLiteral()
  );
  path.replaceWith(targetAST);
}

function transformElseBinding(path, ifBinding, elseBinding) {
  let {
    attr: ifAttr,
    index: ifIndex,
    node: ifNode
  } = ifBinding;
  let {
    node: elseNode,
    index: elseIndex
  } = elseBinding;

  removeAttrASTByIndex(ifNode, ifIndex);
  removeAttrASTByIndex(elseNode, elseIndex);

  const targetAST = t.conditionalExpression(
    ifAttr.value.expression,
    ifNode,
    elseNode
  );
  path.replaceWith(targetAST);
}

function transformElseIfBindings(path, ifBinding, elseIfBindings, elseBinding) {
  let {
    attr: ifAttr,
    index: ifIndex,
    node: ifNode
  } = ifBinding;

  removeAttrASTByIndex(ifNode, ifIndex);
  if (elseBinding) {
    const {
      node: elseNode,
      index: elseIndex
    } = elseBinding;
    removeAttrASTByIndex(elseNode, elseIndex);
  }
  elseIfBindings.forEach(binding => {
    const { node, index } = binding;
    removeAttrASTByIndex(node, index);
  });

  const callee = t.arrowFunctionExpression([], t.blockStatement([
    t.ifStatement(
      ifAttr.value.expression,
      t.returnStatement(ifNode),
      getAlternteAST(elseIfBindings, elseBinding)
    )
  ]));
  const targetAST = t.callExpression(callee, []);
  path.replaceWith(targetAST);
}

function getAlternteAST(elseIfBindings, elseBinding, index = 0) {
  if (index < elseIfBindings.length) {
    const elseIfBinding = elseIfBindings[index];
    let {
      attr,
      node: elseIfNode
    } = elseIfBinding;
    return t.ifStatement(
      attr.value.expression,
      t.returnStatement(elseIfNode),
      getAlternteAST(elseIfBindings, elseBinding, index + 1)
    );
  }
  if (elseBinding) {
    let {
      node: elseNode
    } = elseBinding;
    return t.returnStatement(elseNode);
  }
  return null;
}

function log(...args) {
  args.forEach(i => {
    console.log(JSON.stringify(i, '', '   '));
  });
}

function throwAttributeError(path, attributeNode, msg) {
  const errorPath = path.get('openingElement').get('attributes').find(p => p.node === attributeNode);
  throw errorPath.buildCodeFrameError(msg);
}

function isRequired(path, name) {
  const ctx = { imported: false };
  const names = Array.isArray(name) ? [...name] : [name];
  if (!names.length) return true;

  path.traverse({
    ImportDeclaration(path) {
      const { type, value } = path.node.source;
      if (type !== 'StringLiteral') return;
      const idx = names.indexOf(value);
      if (idx < 0) return;

      names.splice(idx, 1);

      if (!names.length) {
        this.imported = true;
        path.stop();
      }
    }
  }, ctx);
  return ctx.imported;
}

function isReactComponent(path) {
  return isRequired(path, 'react');
  // const { code, opts: { filename } } = path.scope.hub.file;
  // return filename.endsWith('.jsx') || code.test("import React from 'react';\n");
}

function parseCondition(conditionAttribute) {
  let condition;
  if (t.isStringLiteral(conditionAttribute.value)) {
    condition = t.identifier(conditionAttribute.value.value);
  } else if (t.isJSXExpressionContainer(conditionAttribute.value)) {
    condition = conditionAttribute.value.expression;
  }

  return condition;
}

function createDisplayProp(condition, showValue) {
  return t.ObjectProperty(
    t.identifier('display'),
    t.ConditionalExpression(
      condition,
      showValue,
      t.StringLiteral('none'),
    ),
  );
}

function mergeFns(func1, func2, params) {
  func1.body.body.push(t.returnStatement(
    t.callExpression(
      func2,
      params || func1.params
    )
  ));
  return func1;
}

function mergeAttrEvent(handlerNode, funcExpression, params) {
  handlerNode.value = t.JSXExpressionContainer(mergeFns(
    funcExpression,
    handlerNode.value.expression,
    params
  ));
  // let params = params || funcExpression.params;
  // handlerNode.value = t.JSXExpressionContainer(
  //   t.arrowFunctionExpression(
  //     params,
  //     t.blockStatement([
  //       t.expressionStatement(
  //         t.callExpression(funcExpression, params)
  //       ),
  //       t.expressionStatement(
  //         t.callExpression(callee, params)
  //       )
  //     ])
  //   )
  // );
}

function appendAttrEvent(node, eventName, funcExpression) {
  const handlerNode = node.parent.attributes.find(attr =>
    (attr.name && (attr.name.namespace ? attr.name.namespace.name : attr.name.name)) === eventName);
  if (handlerNode) {
    mergeAttrEvent(handlerNode, funcExpression);
  } else {
    node.insertAfter(t.JSXAttribute(
      t.jSXIdentifier(eventName),
      t.JSXExpressionContainer(funcExpression)
    ));
  }
}

function requireStatement(varName, path) {
  let expr = t.callExpression(t.identifier('require'), [t.stringLiteral(path)]);
  if (varName) {
    expr = t.variableDeclaration(
      'const', [
        t.variableDeclarator(
          t.identifier(varName),
          expr
        )
      ]
    );
  }
  return t.expressionStatement(expr);
}

function addImport(path, items, libraryName) {
  path.unshiftContainer(
    'body',
    t.importDeclaration(
      items.map(name => t.importSpecifier(t.identifier(name), t.identifier(name))),
      t.stringLiteral(libraryName),
    ),
  );
}

function addDefaultImport(path, varName, libraryName) {
  path.unshiftContainer(
    'body',
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(varName))],
      t.stringLiteral(libraryName),
    )
  );
}

function fileExists(path) {
  try {
    return !fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
}

function getConfigPath(filename) {
  let packagePath = findUp.sync('package.json', {
    cwd: path.dirname(filename),
    type: 'file'
  });
  if (packagePath && fileExists(packagePath)) return packagePath;
}

const NOW = (new Date()).format('yyyy-MM-dd hh:mm:ss');
const constCached = [];
function getConstCache(filename) {
  const pkgPath = getConfigPath(filename);
  if (!pkgPath || filename === path.resolve(pkgPath)) return {};

  let cwd;

  let cache = constCached[pkgPath];
  if (!cache) {
    let pkg = require(pkgPath);
    if (!pkg || !Object.keys(pkg).length) return {};

    cwd = path.dirname(pkgPath);

    cache = { pkg, cwd };
    constCached[pkgPath] = cache;

    cache.now = NOW;
  }
  cwd = cache.cwd;

  cache.filename = '/' + path.relative(cwd, filename).replace(/\\/g, '/');
  cache.dirname = '/' + path.relative(cwd, path.dirname(filename)).replace(/\\/g, '/');

  return cache;
}

function childrenToArrayExpr(children, trim) {
  children = children.slice();
  for (let i = children.length - 1; i > -1; i--) {
    let c = children[i];
    if (t.isJSXText(c)) {
      if (trim && (i === 0 || i === children.length - 1) && !c.value.trim()) children.splice(i, 1);
      else children[i] = t.stringLiteral(c.value);
    } else if (t.isJSXExpressionContainer(c)) children[i] = c.expression;
  }
  return children.length === 1 ? children[0] : t.arrayExpression(children);
}

function findClassVarName(classPath) {
  if (t.isClassExpression(classPath)) {
    let parent = classPath.parent;
    if (t.isReturnStatement(parent)) {
      if (t.isClassExpression(parent.argument)) {
        let id = classPath.scope.generateUidIdentifier('_class');
        classPath.scope.parent.push({ id, init: parent.argument });
        parent.argument = id;
      }
      return expr2str(parent.argument);
    }
    if (t.isAssignmentExpression(parent)) return expr2str(parent.left);
    return '';
  }
  return expr2str(classPath.node.id);
}

function findClassStaticMethods(classPath, propertyName) {
  let bodyPath;
  let scope;
  let varName = findClassVarName(classPath);
  
  if (t.isClassExpression(classPath) && classPath.key === 'right') {
    bodyPath = classPath.findParent(path => t.isSequenceExpression(path));
    if (!bodyPath) return;
    scope = bodyPath.scope.block;
  } else {
    bodyPath = classPath.parentPath;
    scope = bodyPath.scope.block;
  }

  let methodsPath;
  bodyPath.traverse({
    CallExpression(path) {
      if (path.scope.block !== scope) return path.skip();
      const expr = path.node;
      if (!expr || methodsPath) return path.stop();
      if (!t.isCallExpression(expr)
        || expr2str(expr.callee) !== '_defineProperty'
        || expr2str(expr.arguments[0]) !== varName
        || expr2str(expr.arguments[1]) !== propertyName) return path.skip();
      path.traverse({
        ObjectExpression(path) {
          if (path.parent !== expr) return path.skip();
          methodsPath = path;
          path.stop();
        }
      });
      if (methodsPath) path.stop();
    }
  });

  return methodsPath;
}

function findConstructorMethods(constructorPath) {
  const methods = [];
  constructorPath.traverse({
    CallExpression(callPath) {
      if (callPath.getFunctionParent() !== constructorPath) return callPath.skip();
      const callNode = callPath.node;
      if (expr2str(callNode.callee) !== '_defineProperty'
      || !t.isThisExpression(callNode.arguments[0])
      || !t.isStringLiteral(callNode.arguments[1])
      || !t.isArrowFunctionExpression(callNode.arguments[2])) return callPath.skip();
      const methodPath = callPath.get('arguments.2');
      methodPath.node.key = t.identifier(callNode.arguments[1].value);
      methods.push(methodPath);
    }
  });
  return methods;
}

function findClassAllMethods(classPath, { staticVars = [], traverseDynamicMethods } = {}) {
  const methods = [];

  staticVars.forEach(key => {
    let methodsPath = findClassStaticMethods(classPath, key);
    if (methodsPath) {
      methodsPath.traverse({
        ObjectMethod(methodPath) {
          if (methodPath.node.kind === 'method') methods.push(methodPath);
        }
      });
    }
  });

  classPath.traverse({
    ClassMethod(methodPath) {
      switch (methodPath.node.kind) {
        case 'method': 
          methods.push(methodPath);
          break;
        case 'constructor':
          methods.push(methodPath);
          if (traverseDynamicMethods) methods.push(...findConstructorMethods(methodPath));
          break;
        default: 
          //
      }
    }
  });

  return methods;
}

function findAllClassAllMethods(programPath, options = {}) {
  const classes = [];
  function ClassVisitor(classPath) {
    if (options.classFilter && !options.classFilter(classPath)) return; 
    classes.push({
      classPath,
      methods: findClassAllMethods(classPath, options)
    });
  }
  programPath.traverse({
    ClassDeclaration: ClassVisitor,
    ClassExpression: ClassVisitor,
    ...(options.traverses || {})
  });

  return classes;
}

function isVuelikeClassMixin(classDeclarationPath) {
  return classDeclarationPath.node.superClass
    && ([`${LibraryVarName}.Mixin`].includes(expr2str(classDeclarationPath.node.superClass)));
}

function isVuelikeClass(classDeclarationPath) {
  let superClass = expr2str(classDeclarationPath.node.superClass);
  if (!superClass) return false;
  return superClass === ComponentName;
}

function isVuelikeClasses(classDeclarationPath) {
  let superClass = expr2str(classDeclarationPath.node.superClass);
  if (!superClass) return false;
  if (superClass === 'React.Component') {
    let declaration = isImportLibrary(classDeclarationPath);
    let specifier = declaration && isImportSpecifier(classDeclarationPath, DecoratorName, declaration);
    if (!specifier) return false;
    let decoratorName = expr2str(specifier.imported);
    if (!decoratorName) return;

    let decorators = classDeclarationPath.node.decorators;
    if (decorators && decorators.some(node => (t.isIdentifier(node.expression) && node.expression.name === decoratorName)
      || (t.isCallExpression(node.expression) && expr2str(node.expression.callee) === decoratorName))) return true;
   
    return Object.keys(classDeclarationPath.scope.bindings).some(key => {
      let binding = classDeclarationPath.scope.bindings[key];
      return Object.keys(binding.scope.bindings).some(v => v === decoratorName);
    });
  } 
  return [ComponentName, `${LibraryVarName}.Mixin`].includes(superClass);
}

function isVuelikeHoc(classPath, vuelikePath) {
  let declaration = isImportLibrary(classPath, vuelikePath);
  let specifier = declaration && isImportSpecifier(classPath, DecoratorName, declaration);
  if (!specifier) return false;
  let decoratorName = expr2str(specifier.imported);
  if (!decoratorName) return;

  let decorators = classPath.node.decorators;
  if (decorators && decorators.some(node => (t.isIdentifier(node.expression) && node.expression.name === decoratorName)
      || (t.isCallExpression(node.expression) && expr2str(node.expression.callee) === decoratorName))) return true;
   
  return Object.keys(classPath.scope.bindings).some(key => {
    let binding = classPath.scope.bindings[key];
    return Object.keys(binding.scope.bindings).some(v => v === decoratorName);
  });
}

function isVuelikeClassHoc(classPath, vuelikePath) {
  return (t.isClassDeclaration(classPath) || t.isClassExpression(classPath)) && isVuelikeHoc(classPath, vuelikePath);
}

function findInstanceHocSpecifier(path, vuelikePath) {
  const specifier = isImportSpecifier(path, DecoratorName, null, vuelikePath);
  return specifier && (expr2str(specifier.imported) === LibraryName)
    ? specifier
    : null;
}

function findInstanceSpecifier(path, vuelikePath) {
  const specifier = isImportSpecifier(path, DecoratorName, null, vuelikePath);
  return specifier && (expr2str(specifier.imported) === InstanceName)
    ? specifier 
    : null;
}

function directiveRegx(regx, prefix = '') {
  return new RegExp(`^${escapeRegx(prefix)}(${regx})(?:[_|:]([a-zA-Z0-9-]+))?((?:\\$[a-zA-Z0-9-]+)*)$`);
}

function parseModifiers(modifiers) {
  let ret = {};
  modifiers && modifiers.split('$').filter(Boolean).forEach(key => ret[key] = true);
  return ret;
}

function parseDirective(directiveName, regx, prefix = '') {
  if (!directiveName || !regx) return;
  if (!(regx instanceof RegExp)) regx = directiveRegx(regx, prefix);
  const matched = directiveName.match(regx);
  if (!matched) return;
  let ret = { };
  let [, name, arg, modifiers] = matched;
  ret.name = name;
  ret.arg = arg || '';
  ret.modifiers = parseModifiers(modifiers);
  return ret;
}

function bindModifiers(value, modifiers) {
  if (modifiers.number) value = `Number(${value})`;
  else if (modifiers.trim) value = `((${value}) || '').trim()`;
  return value;
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function escapeRegx(string) {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
  if (typeof string !== 'string') throw new TypeError('[escapeRegx]Expected a string');
  return string.replace(matchOperatorsRegex, '\\$&');
}

function getImportDeclarations(path) {
  let program = path.isProgram() ? path : path.findParent(p => p.isProgram());
  return program.node.body.filter(node => t.isImportDeclaration(node));
}

function isImportLibrary(path, libraryName = LibraryName) {
  let declaration = getImportDeclarations(path).find(node => node.source.value === libraryName);
  // path.traverse({
  //   ImportDeclaration(path) {
  //     if (path.node.source.value === libraryName) declaration = path.node;
  //     path.stop();
  //   },
  // });
  return declaration;
}

function isImportSpecifier(path, specifierName, declaration, libraryName = LibraryName) {
  let declarations;
  if (!declaration) {
    if (libraryName) declaration = isImportLibrary(path, libraryName);
    else declarations = getImportDeclarations(path);
  } 
  if (declaration) declarations = [declaration];
  let ret;
  declarations && declarations.some(item => ret = item.specifiers.find(v => v.local.name === specifierName));
  return ret;
}

function importSpecifier(path, specifierName, libraryName = LibraryName) {
  let declaration = isImportLibrary(path, libraryName);

  let [local, imported = specifierName] = specifierName.split(',');
  let specifier = imported === 'default'
    ? t.importDefaultSpecifier(t.identifier(local))
    : t.importSpecifier(t.identifier(local), t.identifier(imported));
  if (declaration) {
    if (!isImportSpecifier(path, specifierName, declaration)) {
      declaration.specifiers.push(specifier);
    }
  } else {
    let program = path.isProgram() ? path : path.findParent(p => p.isProgram());
    program.unshiftContainer('body',  t.importDeclaration(
      [specifier],
      t.stringLiteral(libraryName),
    ));
  }
  return specifier;
}

function importDefaultSpecifier(path, specifierName, libraryName = LibraryName) {
  return importSpecifier(path, `${specifierName},default`, libraryName);
}

function attrs2obj(attributes, excludes = []) {
  const attrs = [];
  attributes.forEach(attr => {
    if (t.isJSXSpreadAttribute(attr)) {
      const expr = attr.argument;
      attrs.push(t.spreadElement(expr));
    } else if (t.isJSXAttribute(attr)) {
      let name = expr2str(attr.name);
      if (excludes.includes(name)) return;
      let value = attr.value;
      if (t.isJSXExpressionContainer(value)) value = value.expression;
      attrs.push(t.objectProperty(
        t.identifier(name),
        value
      ));
    }
  });
  return t.objectExpression(attrs);
}

module.exports = {
  DirectiveName,
  DirectiveComponentName,
  SlotComponentName,
  ObserverName,
  ObserverTagName,
  LibraryName,
  LibraryVarName,
  ComponentFlagPrefix,
  DecoratorName,
  ComponentName,
  ScopeName,
  InstanceName,
  LibraryDecoratorName,

  getConstCache,
  fileExists,
  isFunction,
  escapeRegx,
  isRequired,
  isReactComponent,
  addImport,
  addDefaultImport,
  objValueStr2AST,
  objPropStr2AST,
  memberExpr2Str,
  var2Expression,
  obj2Expression,
  arr2Expression,
  expr2str,
  expr2var,
  attrs2obj,
  types,
  getAttrASTAndIndexByName,
  iterativeAttrAST,
  findNextNode,
  transformIfBinding,
  transformElseBinding,
  removeNode,
  removeAttrAST,
  removeAttrASTByIndex,
  removeAttributeVisitor,
  transformElseIfBindings,
  throwAttributeError,
  mergeFns,
  mergeAttrEvent,
  appendAttrEvent,
  parseCondition,
  createDisplayProp,
  requireStatement,
  extractNodeCode,
  findInstanceSpecifier,
  findInstanceHocSpecifier,

  childrenToArrayExpr,
  findClassVarName,
  findClassStaticMethods,
  findConstructorMethods,
  findClassAllMethods,
  findAllClassAllMethods,
  isVuelikeClass,
  isVuelikeClasses,
  isVuelikeClassMixin,
  isVuelikeClassHoc,
  isVuelikeHoc,
  directiveRegx,
  parseDirective,
  parseModifiers,
  bindModifiers,
  isImportSpecifier,
  importSpecifier,
  importDefaultSpecifier,
  log
};
