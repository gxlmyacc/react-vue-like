"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ReactVueLikeDirective: true
};
Object.defineProperty(exports, "ReactVueLikeDirective", {
  enumerable: true,
  get: function get() {
    return _directive.default;
  }
});
exports.default = void 0;

var _mobx = require("./mobx");

var _component = _interopRequireDefault(require("./component"));

var _directive = _interopRequireDefault(require("./directive"));

var _mixin = _interopRequireDefault(require("./mixin"));

var _hook = _interopRequireDefault(require("./hook"));

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

_component.default.Mixin = _mixin.default;
_component.default.observable = _mobx.observable;
_component.default.flow = _mobx.flow;
_component.default.action = _mobx.action;
_component.default._k = _utils.checkKeyCodes;
_component.default.set = _mobx.set;
_component.default.delete = _mobx.remove;
_component.default.isObservable = _mobx.isObservable;
(0, _hook.default)();
var _default = _component.default;
exports.default = _default;