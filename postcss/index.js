const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('react-vue-like-add-id', function (opts) {
  // opts = opts || {
  //   scoped: true,
  //   id: 'v-123dse43'
  // };
  opts = opts || {};
  return function (root) {
    let scoped; let id; let globalSelector = '';
    if (typeof opts === 'function') {
      let _opts = opts(root);
      scoped = _opts.scoped;
      id = _opts.id;
      globalSelector = _opts.globalSelector || '';
    } else {
      scoped = opts.scoped;
      id = opts.id;
      globalSelector = opts.globalSelector || '';
    }
    if (!scoped || !id) return;
    root.each(function rewriteSelector(node) {
      if (!node.selector) {
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector);
        }
        return;
      }
      if (node.selector.startsWith(':global')) {
        node.selector = node.selector.replace(/:global/g, globalSelector).trim();
      } else if (node.selector.includes(':scope')) {
        node.selector = node.selector.replace(/:scope/g, '.' + id);
      } else {
        node.selector = selectorParser(function (selectors) {
          selectors.each(function (selector) {
            if (!selector.nodes.length) return;

            let idx = selector.nodes.findIndex(n => n.type === 'combinator' && n.value === '>>>');
            let lastNode;
            if (idx < 0) idx = selector.nodes.length - 1;
            else {
              selector.nodes.splice(idx, 1);
              lastNode = selector.nodes[idx];
              idx--;
            }
            for (; idx > -1; idx--) {
              let node = selector.nodes[idx];
              if (node.type !== 'pseudo' && node.type !== 'combinator') {
                let afterSpace = '';
                if (lastNode) {
                  if (lastNode.type === 'combinator' && lastNode.value !== ' ') afterSpace = ' ';
                  else if (lastNode.type === 'string' && lastNode.value !== ' ') afterSpace = ' ';
                  else if (lastNode.type !== 'pseudo' && lastNode.spaces.before === '') afterSpace = ' ';
                }
                selector.nodes.splice(idx + 1, 0, selectorParser.className({
                  value: id,
                  spaces: {
                    after: afterSpace
                  }
                }));
                break;
              }
              lastNode = node;
            }
          });
        }).processSync(node.selector.replace('> > >', '>>>'));
      }
    });
  };
});
