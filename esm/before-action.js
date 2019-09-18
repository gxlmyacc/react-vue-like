"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeAction;

var _mobx = require("./mobx");

var _utils = require("./utils");

const reserved = ['constructor', 'data', 'provide', 'render'];

function _handleAction(target, key, flows) {
  let v = target[key];
  if (!(0, _utils.isFunction)(v)) return;
  let n = flows.includes(key) ? (0, _mobx.flow)(v) : (0, _mobx.action)(key, v);
  if (v !== n) target[key] = n;
}

function beforeAction(target) {
  if (!target) return;
  let flows = target.__flows || [];

  if (target.methods) {
    Object.keys(target.methods).forEach(function (key) {
      return _handleAction(target.methods, key, flows);
    });
  }

  Object.getOwnPropertyNames(target.prototype).forEach(function (key) {
    return !reserved.includes(key) && _handleAction(target.prototype, key, flows);
  });
}