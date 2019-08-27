const bt = require('babel-types');


function addImportVModel(programPath) {
  programPath.unshiftContainer(
    'body',
    bt.importDeclaration(
      [
        bt.importSpecifier(
          bt.identifier('getVModelValue'),
          bt.identifier('getVModelValue'),
        ),
        bt.importSpecifier(
          bt.identifier('createVModelEventHandler'),
          bt.identifier('createVModelEventHandler'),
        ),
      ],
      bt.stringLiteral('babel-plugin-vue-like-for-react-and-mobx/vmodel'),
    ),
  );
}

function isSubClassOfReactComponent(classNode) {
  if (classNode.body && Array.isArray(classNode.body.body) && classNode.body.body.length > 0) {
    return classNode.body.body.findIndex(node => {
      if (node.type === 'ClassMethod' && node.key && node.key.name === 'render') {
        return true;
      }
      return false;
    }) !== -1;
  }
  return false;
}

const Visitor = {
  ClassDeclaration(path) {
    if (isSubClassOfReactComponent(path.node)) {
      console.log('ddddd');
    }
  },
};

module.exports = function create(babel) {
  return {
    visitor: {
      Program: {
        enter(path) {
          const result = {
            hasVModel: false,
          };

          path.traverse(Visitor, result);

          // 如果存在 vmodel属性，那就构建 import
          if (result.hasVModel) {
            addImportVModel(path);
          }
        },
      },
    },
  };
};
