const { isReactComponent } = require('../utils');

module.exports = function ({ types: t }) {
  function JSXElementVisitor(path) {
    path.traverse({
      JSXAttribute: JSXAttributeVisitor
    });
  }

  function JSXAttributeVisitor(node) {
    if (node.node.name.name === 'class') {
      node.node.name.name = 'className';
    }
  }

  return {
    visitor: {
      Program: {
        enter(path) {
          if (!isReactComponent(path)) return;

          path.traverse({
            JSXElement: JSXElementVisitor
          });
        },
      },
    }
  };
};
