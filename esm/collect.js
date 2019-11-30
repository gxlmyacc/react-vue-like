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

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;

var Collect =
/*#__PURE__*/
function () {
  function Collect() {
    _classCallCheck(this, Collect);
  }

  _createClass(Collect, [{
    key: "start",
    value: function start() {
      this.elements = [];
    }
  }, {
    key: "end",
    value: function end(root) {
      var elements = this.elements || [];
      this.elements = null;

      var getRoot = function getRoot(root) {
        if (!root) return root;
        if (Array.isArray(root)) return root.map(function (r) {
          return getRoot(r);
        });
        if (root.__collect) root.__collect.isRoot = true;
        return root.__collect || root;
      };

      return {
        root: getRoot(root),
        elements: elements
      };
    }
  }, {
    key: "push",
    value: function push(fn, component, props, children) {
      props = props || {};
      var node = {
        __collect: {
          fn: fn,

          /* cid: this.elements.length, */
          component: component,
          props: props,
          children: children
        },
        $$typeof: REACT_ELEMENT_TYPE,
        props: props,
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
  }, {
    key: "render",
    value: function render(ctx, elements, each) {
      elements && elements.forEach(function (node) {
        var _el$fn;

        var el = node.__collect;
        delete node.__collect;
        each && each.call(ctx, el.component, el.props, el.children, Boolean(el.isRoot));

        var ret = (_el$fn = el.fn).call.apply(_el$fn, [_react.default, el.component, el.props].concat(_toConsumableArray(el.children)));

        if (ret) Object.defineProperties(node, Object.getOwnPropertyDescriptors(ret));
      });
    }
  }, {
    key: "wrap",
    value: function wrap(fn, each, pre, after) {
      if (!fn || !_config.default.useCollect) return fn;
      var collect = this;
      return function render() {
        collect.start();
        var result = fn.apply(this, arguments);

        var _collect$end = collect.end(result),
            root = _collect$end.root,
            elements = _collect$end.elements;

        pre && pre(root);
        collect.render(this, elements, each);
        after && after(result);
        return result;
      };
    }
  }, {
    key: "isRendering",
    get: function get() {
      return Boolean(this.elements);
    }
  }]);

  return Collect;
}();

var _default = new Collect();

exports.default = _default;