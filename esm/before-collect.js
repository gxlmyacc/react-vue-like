"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = beforeCollect;

function beforeCollect(target) {
  var t = target.prototype;

  if (hasOwnProperty.call(t, 'render')) {
    t._renderFn = t.render;
    delete t.render;
  }

  if (hasOwnProperty.call(t, 'renderError')) {
    t._renderErrorFn = t.renderError;
    delete t.renderError;
  }
}