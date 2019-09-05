const { declare } = require('@babel/helper-plugin-utils');
const path = require('path');
const { fileExists } = require('./utils');
const options = require('./options');
const transformClass = require('./transforms/transform-class');
const transformFilter = require('./transforms/transform-filter');
const transformConst = require('./transforms/transform-const');
const transformRef = require('./transforms/transform-ref');
// const vFor = require('./directives/v-for');
const vIf = require('./directives/v-if');
const vShow = require('./directives/v-show');
const vModel = require('./directives/v-model');
const vCustomDirective = require('./directives/v-custom-directive');

const injectFile = require('./injects/inject-file');
const injectScope = require('./injects/inject-scope');

let pkg;
if (fileExists(path.join(process.cwd(), 'package.json'))) {
  pkg = require(path.join(process.cwd(), 'package.json'));
}

module.exports = declare((api, opts = {}) => {
  api.assertVersion(7);
  if (!opts) opts = {};
  const { attrName, transform, directive, inject, ...others } = opts;

  if (attrName) Object.assign(options.attrName, attrName);
  if (transform) Object.assign(options.transform, transform);
  if (directive) Object.assign(options.directive, directive);
  if (inject) Object.assign(options.inject, inject);
  Object.assign(options, others);

  Object.keys(options.attrName).forEach(key => options.attrName[key] = `${options.prefix}${options.attrName[key]}`);


  options.attrNameKeys = Object.keys(options.attrName).map(key => options.attrName[key]);

  options.pkg = pkg;

  const plugins = [];

  if (options.inject.file) plugins.push(injectFile);
  if (options.inject.scope) plugins.push(injectScope);

  if (options.transform.class) plugins.push(transformClass);
  if (options.transform.filter) plugins.push(transformFilter);
  if (options.transform.const) plugins.push(transformConst);
  if (options.transform.ref) plugins.push(transformRef);

  if (options.directive.if) plugins.push(vIf);
  if (options.directive.show) plugins.push(vShow);
  if (options.directive.model) plugins.push(vModel);
  if (options.directive.custom) plugins.push(vCustomDirective);

  return {
    plugins
  };
});

