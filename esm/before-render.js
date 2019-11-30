"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeCollect;

var _component = _interopRequireDefault(require("./component"));

var _collect = _interopRequireDefault(require("./collect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function beforeCollect(target) {
  var t = target.prototype;

  if (hasOwnProperty.call(t, 'render')) {
    t._renderFn = _collect.default.wrap(t.render, _component.default.prototype._eachRenderElement);
    delete t.render;
  }

  if (hasOwnProperty.call(t, 'renderError')) {
    t._renderErrorFn = _collect.default.wrap(t.renderError, _component.default.prototype._eachRenderElement);
    delete t.renderError;
  }
}