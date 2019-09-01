"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMergeStrategies = defaultMergeStrategies;
exports.default = void 0;

require("core-js/modules/es6.object.assign");

function defaultMergeStrategies(parent, child, vm) {
  return child;
}

function directivesMergeStrategies(parent, child, vm) {
  var ret = {};
  if (parent) return Object.assign(ret, parent);
  if (child) return Object.assign(ret, child);
  return ret;
}

var config = {
  silent: false,
  errorHandler: null,
  warnHandler: null,
  inheritMergeStrategies: {},
  optionMergeStrategies: {
    $directives: directivesMergeStrategies,
    $filters: directivesMergeStrategies
  }
};
var _default = config;
exports.default = _default;