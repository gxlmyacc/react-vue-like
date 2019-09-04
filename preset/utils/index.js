
const t = require('@babel/types');
const template = require('@babel/template').default;
const types = require('./types');

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
    default: //
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
  return ret.join('\n');
}

function expr2str(expr) {
  if (expr.extra) return expr.extra.raw;
  switch (expr.type) {
    case 'MemberExpression':
      return memberExpr2Str(expr);
    case 'Identifier':
      return expr.name;
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
      objStr = memberExpr2Str(expr.object);
      break;
    case 'Identifier':
      objStr = expr.object.name;
      break;
    case 'ThisExpression':
      objStr = 'this';
      break;
    default: /* empty */
  }
  return objStr + (objStr ? '.' : '') + expr.property.name;
}

function findNextNode(path, siblings, index) {
  if (!siblings) return null;

  const nextPath = siblings[index + 1];
  if (!nextPath) return null;

  const { type, value } = nextPath;
  if (type === 'JSXText' && !value.trim()) return findNextNode(nextPath, siblings, index + 1);
  return type === 'JSXElement' ? nextPath : null;
}

function getAttrASTAndIndexByName(node, attrName) {
  if (!node || !node.openingElement) return null;

  const { type, attributes } = node.openingElement;
  if (type !== 'JSXOpeningElement') return null;

  const index = attributes.findIndex(
    attr => attr.name && attr.name.name === attrName
  );
  if (index < 0) return null;

  const attrBinding = attributes[index];
  return {
    attrBinding,
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
  const { attrBinding, index, node } = ifBinding;

  removeAttrASTByIndex(node, index);

  const targetAST = t.conditionalExpression(
    attrBinding.value.expression,
    node,
    t.nullLiteral()
  );
  path.replaceWith(targetAST);
}

function transformElseBinding(path, ifBinding, elseBinding) {
  const {
    attrBinding: ifAttr,
    index: ifIndex,
    node: ifNode
  } = ifBinding;
  const {
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
  const {
    attrBinding: ifAttr,
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
  if (index + 1 < elseIfBindings.length) {
    const elseIfBinding = elseIfBindings[index];
    const {
      attrBinding,
      node
    } = elseIfBinding;
    return t.ifStatement(
      attrBinding.value.expression,
      t.returnStatement(node),
      getAlternteAST(elseIfBindings, elseBinding, index + 1)
    );
  }
  if (elseBinding) {
    return t.returnStatement(elseBinding.node);
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

function appendAttrEvent(node, eventName, funcExpression) {
  const handlerNode = node.parent.attributes.filter(attr => (attr && attr.name && attr.name.name) === eventName)[0];
  const argument = t.identifier('e');
  if (handlerNode) {
    const callee = handlerNode.value.expression;
    handlerNode.value = t.JSXExpressionContainer(
      t.arrowFunctionExpression(
        [argument],
        t.blockStatement([
          t.expressionStatement(
            t.callExpression(
              funcExpression,
              [argument]
            )
          ),
          t.expressionStatement(
            t.callExpression(
              callee,
              [argument]
            )
          )
        ])
      )
    );
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


function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
}

module.exports = {
  camelize,
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
  appendAttrEvent,
  parseCondition,
  createDisplayProp,
  requireStatement,
  extractNodeCode,
  log
};