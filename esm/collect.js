"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REACT_FORWARD_REF_TYPE = void 0;

var _react = _interopRequireDefault(require("react"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

const ForwardRefMeth = _react.default.forwardRef(function () {
  return null;
});

const REACT_FORWARD_REF_TYPE = ForwardRefMeth.$$typeof;
exports.REACT_FORWARD_REF_TYPE = REACT_FORWARD_REF_TYPE;

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
      if (root.__collect) root.__collect.isRoot = true;
      return root.__collect || root;
    };

    return {
      root: getRoot(root),
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

  render(elements, each) {
    elements.forEach(function (node) {
      const el = node.__collect;
      delete node.__collect;
      const props = el.props || {};
      each && each(el.component, props, el.children, Boolean(el.isRoot));
      Object.assign(node, _react.default.createElement.apply(_react.default, [el.component, props].concat(_toConsumableArray(el.children))));
    });
  }

  wrap(fn, each, pre, after) {
    if (!fn || !_config.default.useCollect) return fn;
    let collect = this;
    return function render() {
      collect.start();
      let result = fn.apply(this, arguments);

      let _collect$end = collect.end(result),
          root = _collect$end.root,
          elements = _collect$end.elements;

      pre && pre(root);
      collect.render(elements, each);
      after && after(result);
      return result;
    };
  }

}

var _default = new Collect();

exports.default = _default;