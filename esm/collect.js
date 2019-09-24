"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;

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

  push(fn, component, props, children) {
    props = props || {};
    const node = {
      __collect: {
        fn,

        /* cid: this.elements.length, */
        component,
        props,
        children
      },
      $$typeof: REACT_ELEMENT_TYPE,
      props,
      ref: props.ref || null,
      key: props.key || null,
      type: component,
      _store: {
        validated: Boolean(component) && (typeof component === 'string' || component.prototype instanceof _react.default.Component)
      }
    };
    this.elements.push(node);
    return node;
  }

  render(elements, each) {
    elements.forEach(function (node) {
      var _el$fn;

      const el = node.__collect;
      delete node.__collect;
      each && each(el.component, el.props, el.children, Boolean(el.isRoot));

      let ret = (_el$fn = el.fn).call.apply(_el$fn, [_react.default, el.component, el.props].concat(_toConsumableArray(el.children)));

      if (ret) Object.defineProperties(node, Object.getOwnPropertyDescriptors(ret));
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