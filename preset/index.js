const { declare } = require('@babel/helper-plugin-utils');
const options = require('./options');
const transformClass = require('./transforms/transform-class');
const transformFilter = require('./transforms/transform-filter');
// const vFor = require('./directives/v-for');
const vIf = require('./directives/v-if');
const vShow = require('./directives/v-show');
const vModel = require('./directives/v-model');
const vCustomDirective = require('./directives/v-custom-directive');

module.exports = declare((api, opts = {}) => {
  api.assertVersion(7);

  if (opts) {
    if (opts.attrName) Object.assign(options.attrName, opts.attrName);
  }

  options.attrNameKeys = Object.keys(options.attrName).map(key => options.attrName[key]);
  const plugins = [
    transformClass,
    transformFilter,
    vIf,
    vShow,
    // vFor,
    vModel,
    vCustomDirective,
  ];

  return {
    plugins
  };
});

