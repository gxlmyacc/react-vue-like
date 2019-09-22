"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _before = _interopRequireDefault(require("./before"));

var _collect = _interopRequireDefault(require("./collect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReactHook() {
  const _createElement = _react.default.createElement;

  _react.default.createElement = function createElement(Component, props) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (_collect.default.elements) return _collect.default.push(Component, props, children);
    const $component = props && props.$component;

    if ($component) {
      Component = $component;
      delete props.$component;
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

var _default = ReactHook;
exports.default = _default;