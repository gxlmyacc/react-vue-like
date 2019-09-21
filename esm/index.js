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

var _react = _interopRequireDefault(require("react"));

var _mobx = require("./mobx");

var _component = _interopRequireDefault(require("./component"));

var _directive = _interopRequireDefault(require("./directive"));

var _mixin = _interopRequireDefault(require("./mixin"));

var _store = _interopRequireDefault(require("./store"));

var _before = _interopRequireDefault(require("./before"));

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
_component.default.Mixin = _mixin.default;
_component.default.observable = _mobx.observable;
_component.default.flow = _mobx.flow;
_component.default.action = _mobx.action;
_component.default._k = _utils.checkKeyCodes;

function ReactHook() {
  const _createElement = _react.default.createElement;

  _react.default.createElement = function createElement(Component, props) {
    const $component = props && props.$component;

    if ($component) {
      Component = $component;
      delete props.$component;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (!Component) return _createElement.call.apply(_createElement, [this, Component, props].concat(children));
    Component = (0, _before.default)(Component, props);
    let newComponent;

    if (Component.beforeConstructor) {
      var _Component;

      newComponent = (_Component = Component).beforeConstructor.apply(_Component, [props].concat(children));
    }

    return _createElement.call.apply(_createElement, [this, newComponent || Component, props].concat(children));
  };
}

ReactHook();
var _default = _component.default;
exports.default = _default;