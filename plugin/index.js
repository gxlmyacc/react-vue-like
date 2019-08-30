const bt = require('babel-types');

const {
  // isSubClassOfReactComponent,
  addVModelValueAttr,
  addVModelEventAttr,
  addImportVModel,
} = require('./util');


const VModelVisitor = {
  JSXAttribute(path) {
    const { node } = path;

    // 如果存在 v-model 属性，才做转化
    if (node.name && node.name.type === 'JSXIdentifier' && node.name.name === 'v-model') {
      const elementPath = path.findParent(parentPath => parentPath.type === 'JSXOpeningElement');
      if (!elementPath) {
        throw new Error('not find "v-model" attribute in jsx node!');
      }

      let vModelPropValue = null;
      if (node.value.type === 'StringLiteral') {
        // v-model="a.b.c"
        vModelPropValue = bt.clone(node.value);
      } else {
        // v-model={...}
        vModelPropValue = bt.clone(node.value.expression);
      }

      // 增加属性：  value={getVModelValue(this, "a.b.c")}
      addVModelValueAttr(elementPath, vModelPropValue);

      // 增加属性：  onChange={(event) => handleVModelEvent(this, "a.b.c", event)}
      addVModelEventAttr(elementPath, vModelPropValue);

      // 记录下存在 v-model 属性
      this.hasVModel = true;
    }
  },
};

// 找到ReactComponent定义的类
// const ReactComponentVisitor = {
//   ClassDeclaration(path) {
//     if (isSubClassOfReactComponent(path.node)) {
//       // 如果是一个React组件定义类，那就继续找相关的属性
//       const result = {
//         hasVModel: this.hasVModel,
//       };
//       path.traverse(VModelVisitor, result);
//       if (result.hasVModel) {
//         this.hasVModel = true;
//       }
//     }
//   },
// };

module.exports = function create(babel) {
  return {
    visitor: {
      Program: {
        enter(path) {
          const result = {
            hasVModel: false,
          };

          path.traverse(VModelVisitor, result);

          // 如果存在 vmodel属性，那就构建 import
          if (result.hasVModel) {
            addImportVModel(path);
          }
        },
      },
    },
  };
};
