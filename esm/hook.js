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
  var _createElement = _react.default.createElement;
  var _cloneElement = _react.default.cloneElement;

  function createElement(Component, props) {
    var $component = props && props.$component;

    if ($component) {
      Component = $component;
      delete props.$component;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (!Component) return _createElement.call.apply(_createElement, [this, Component, props].concat(children));
    Component = (0, _before.default)(Component, props);
    var newComponent;

    if (Component.beforeConstructor) {
      var _Component;

      newComponent = (_Component = Component).beforeConstructor.apply(_Component, [props].concat(children));
      if (newComponent !== undefined) Component = newComponent;
    }

    var $slotFn = props && props.$slotFn;
    if ($slotFn) return $slotFn(props || {}, children);
    if (Component === 'template') Component = _react.default.Fragment;
    if (_collect.default.elements) return _collect.default.push(_createElement, Component, props, children);
    return _createElement.call.apply(_createElement, [this, Component, props].concat(children));
  }

  function cloneElement(element, props) {
    for (var _len2 = arguments.length, children = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      children[_key2 - 2] = arguments[_key2];
    }

    if (_collect.default.elements) return _collect.default.push(_cloneElement, element, props, children);
    return _cloneElement.call.apply(_cloneElement, [this, element, props].concat(children));
  }

  _react.default.createElement = createElement;
  _react.default.cloneElement = cloneElement;
}

var _default = ReactHook;
exports.default = _default;