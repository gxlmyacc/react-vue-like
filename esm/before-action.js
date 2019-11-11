"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeAction;

var _mobx = require("./mobx");

var _utils = require("./utils");

var reserved = ['constructor', 'data', 'provide', 'render', 'renderError'];

function _handleAction(target, key, flows) {
  // if (/^render\w*$/.test(key) && !flows.includes(key)) return;
  var v = target[key];
  if (!(0, _utils.isFunction)(v)) return;
  var isFlow = flows.includes(key);
  var n = isFlow ? (0, _mobx.flow)(v) : (0, _mobx.action)(key, v);

  if (v !== n) {
    // let actionWrap = function actionWrap() {
    //   if (!this._isRendering) return n.apply(this, arguments);
    //   this[key] = v;
    //   return v.apply(this, arguments);
    // };
    // actionWrap.isMobxAction = true;
    target[key] = n; // isFlow ? n : actionWrap;
  }
}

function beforeAction(target) {
  if (!target) return;
  var flows = target.__flows || [];

  if (target.methods) {
    Object.keys(target.methods).forEach(function (key) {
      return _handleAction(target.methods, key, flows);
    });
  }

  Object.getOwnPropertyNames(target.prototype).forEach(function (key) {
    return !reserved.includes(key) && _handleAction(target.prototype, key, flows);
  });
}