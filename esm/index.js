"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  propcheck: true
};
Object.defineProperty(exports, "propcheck", {
  enumerable: true,
  get: function get() {
    return _propCheck.default;
  }
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

var _store = _interopRequireDefault(require("./store"));

var _propCheck = _interopRequireDefault(require("./prop-check"));

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_component.default.Store = _store.default;
var _default = _component.default;
exports.default = _default;