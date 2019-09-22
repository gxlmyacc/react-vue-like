"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

class Collect {
  start() {
    this.elements = [];
  }

  end(root) {
    let elements = this.elements;
    this.elements = null;

    const getRoot = function getRoot(root) {
      if (!root) return root;
      if (Array.isArray(root)) return root.map(function (r) {
        return getRoot(r);
      });
      return root.__collect || root;
    };

    return {
      root: getRoot(root),
      result: root,
      elements
    };
  }

  push(component, props, children) {
    const node = {
      __collect: {
        cid: this.elements.length,
        component,
        props,
        children
      }
    };
    this.elements.push(node);
    return node;
  }

  render(root, elements, each) {
    const na = !Array.isArray(root);
    elements.forEach(function (node) {
      const el = node.__collect;
      delete node.__collect;
      const props = el.props || {};
      each && each(el.component, props, el.children, root && (na ? root === el : root.includes(el)));
      Object.assign(node, _react.default.createElement.apply(_react.default, [el.component, props].concat(_toConsumableArray(el.children))));
    });
  }

  wrap(fn, each, after) {
    if (!fn) return fn;
    let collect = this;
    return function render() {
      collect.start();
      let result = fn.apply(this, arguments);

      let _collect$end = collect.end(result),
          root = _collect$end.root,
          elements = _collect$end.elements;

      collect.render(root, elements, each);
      after && after(result);
      return result;
    };
  }

}

var _default = new Collect();

exports.default = _default;