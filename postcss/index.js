const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('react-vue-like-add-id', function (opts) {
  // opts = opts || {
  //   scoped: true,
  //   id: 'v-data-123dse43'
  // };
  opts = opts || {};
  return function (root) {
    if (!opts.scoped || !opts.id) return;
    root.each(function rewriteSelector(node) {
      if (!node.selector) {
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector);
        }
        return;
      }
      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          let idx = selector.nodes.findIndex(n => n.type === 'combinator' && n.value === '>>>');
          if (idx > 0) {
            selector.nodes.splice(idx, 1, selectorParser.className({
              value: opts.id
            }), selectorParser.string({ value: ' ' }));
          } else {
            selector.append(selectorParser.className({
              value: opts.id
            }));
          }
        });
      }).processSync(node.selector);
    });
  };
});
