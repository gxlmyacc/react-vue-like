const { isReactComponent } = require('../utils');

module.exports = function ({ types: t }) {
  function JSXElementVisitor(path) {
    path.traverse({
      JSXAttribute: JSXAttributeVisitor
    });
  }

  function JSXAttributeVisitor(path) {
    if (path.node.name.name === 'class') {
      // removeAttributeVisitor(path, path.node);
      path.node.name.name = 'className';
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
