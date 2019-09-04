const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('react-vue-like-add-id', function (opts) {
  opts = opts || {};
  return function (root) {
    if (!opts.scoped || !opts.id) return;
    // opts = { id: 'aaaaaaaaaaaaaaa' };
    root.each(function rewriteSelector(node) {
      if (!node.selector) {
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector);
        }
        return;
      }
      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          if (!opts.deep) {
            let node = null;
            selector.each(function (n) {
              if (n.type !== 'pseudo') node = n;
            });
            selector.insertAfter(node, selectorParser.className({
              value: opts.id
            }));
          } else {
            selector.prepend(selectorParser.className({
              value: opts.id
            }));
          }
        });
      }).processSync(node.selector);
    });
  };
});
