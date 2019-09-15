"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeAction;

require("core-js/modules/es7.array.includes");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

var _mobx = require("./mobx");

var _utils = require("./utils");

var reserved = ['constructor', 'data', 'provide', 'render'];

function _handleAction(target, key) {
  var v = target[key];
  if (!(0, _utils.isFunction)(v)) return;
  var n = (0, _mobx.action)(key, v);
  if (v !== n) target[key] = n;
}

function beforeAction(target) {
  if (!target) return;

  if (target.methods) {
    Object.keys(target.methods).forEach(function (key) {
      return _handleAction(target.methods, key);
    });
  }

  Object.getOwnPropertyNames(target.prototype).forEach(function (key) {
    return !reserved.includes(key) && _handleAction(target.prototype, key);
  });
}