const postcss = require('postcss');
const postcssPkg = require('postcss/package.json');
const { getRemainingRequest, getOptions, getCurrentRequest } = require('loader-utils');
const qs = require('qs');
const pkg = require('../package.json');
const postcssPlugin = require('../postcss');

const REGX = new RegExp(`${pkg.name}&scoped=true&id=([a-z0-9-]+)`);

module.exports = function loader(content, map, meta) {
  const options = getOptions(this) || {};

  const callback = this.async();

  let [, _query] = (this.request.match(/\?([a-z0-9-&=!]+)$/i) || []);
  if (!_query) return this.callback(null, content, map, meta);
  const matched = _query.match(REGX);
  if (!matched) return this.callback(null, content, map, meta);


  if (meta) {
    const { ast } = meta;

    if (ast && ast.type === 'postcss' && ast.version === postcssPkg.version) {
      // eslint-disable-next-line no-param-reassign
      content = ast.root;
    }
  }

  const plugins = [postcssPlugin(qs.parse(_query))];

  postcss(plugins)
    .process(content, {
      from: getRemainingRequest(this)
        .split('!')
        .pop(),
      to: getCurrentRequest(this)
        .split('!')
        .pop(),
      map: options.sourceMap
        ? {
          prev: map,
          inline: false,
          annotation: false,
        }
        : null,
    })
    .then(result => {
      result
        .warnings()
        .forEach(warning => this.emitWarning(warning));

      return callback(
        null,
        result.content,
        meta
      );
    })
    .catch(callback);
};
