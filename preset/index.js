const { declare } = require('@babel/helper-plugin-utils');
const syntaxJsx = require('@babel/plugin-syntax-jsx').default;
const path = require('path');
const { fileExists, isFunction, directiveRegx } = require('./utils');
const options = require('./options');
const transformClass = require('./transforms/transform-class');
const transformRequire = require('./transforms/transform-require');
const transformModifier = require('./transforms/transform-modifier');
const transformComponent = require('./transforms/transform-component');
const transformAction = require('./transforms/transform-action');
const transformFilter = require('./transforms/transform-filter');
const transformDefine = require('./transforms/transform-define');
const transformRef = require('./transforms/transform-ref');
const transformSlot = require('./transforms/transform-slot');
const vIf = require('./directives/v-if');
const vShow = require('./directives/v-show');
const vModel = require('./directives/v-model');
const vHtml = require('./directives/v-html');
const vObserver = require('./directives/v-observer');
const vCustomDirective = require('./directives/v-custom-directive');

const injectFile = require('./injects/inject-file');
const injectScope = require('./injects/inject-scope');
const injectAttrs = require('./injects/inject-attrs');

let pkg;
if (fileExists(path.join(process.cwd(), 'package.json'))) {
  pkg = require(path.join(process.cwd(), 'package.json'));
}

function pluginHook(plugin) {
  if (!isFunction(plugin)) return plugin;
  return function () {
    let ret = plugin.apply(this, arguments);
    if (!ret.inherits) ret.inherits = syntaxJsx;
    return ret;
  };
}

let loaded = false;

module.exports = declare((api, opts = {}) => {
  api.assertVersion(7);
  if (!opts) opts = {};
  if (!loaded) {
    loaded = true;
    const { attrName, transform, directive, inject, ...others } = opts;

    if (attrName) Object.assign(options.attrName, attrName);
    if (transform) Object.assign(options.transform, transform);
    if (directive) Object.assign(options.directive, directive);
    if (inject) Object.assign(options.inject, inject);
    Object.assign(options, others);

    Object.keys(options.attrName).forEach(key => options.attrName[key] = `${options.prefix}${options.attrName[key]}`);

    options.directiveRegx = directiveRegx('[a-z0-9\\-]+', options.prefix);
    options.attrNameKeys = Object.keys(options.attrName).map(key => options.attrName[key]);

    options.inject.attrs = !options.useCollect;
    // options.inject.scopeAttrs = !options.useCollect;

    options.pkg = pkg;
  }

  let plugins = [
  ];

  if (options.transform.class) plugins.push(transformClass);
  if (options.transform.require) plugins.push(transformRequire);
  if (options.transform.modifier) plugins.push(transformModifier);
  if (options.transform.component) plugins.push(transformComponent);
  if (options.transform.action) plugins.push(transformAction);
  if (options.transform.filter) plugins.push(transformFilter);
  if (options.transform.define) plugins.push(transformDefine);
  if (options.transform.ref) plugins.push(transformRef);
  if (options.transform.slot) plugins.push(transformSlot);

  if (options.directive.if) plugins.push(vIf);
  if (options.directive.show) plugins.push(vShow);
  if (options.directive.model) plugins.push(vModel);
  if (options.directive.html) plugins.push(vHtml);
  if (options.directive.observer) plugins.push(vObserver);
  if (options.directive.custom) plugins.push(vCustomDirective);

  if (options.inject.file) plugins.push(injectFile);
  if (options.inject.scope) plugins.push(injectScope);
  if (options.inject.attrs) plugins.push(injectAttrs);

  plugins = plugins.map(p => pluginHook(p));

  return {
    plugins
  };
});

