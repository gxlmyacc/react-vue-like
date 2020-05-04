"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

var _react = _interopRequireDefault(require("react"));

var _test = _interopRequireDefault(require("test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

// import ReactVueLike from 'react-vue-like';
class App extends _reactVueLike.default.Component {
  render() {
    return /*#__PURE__*/_react.default.createElement(_test.default.Child, _extends({
      className: "root"
    }, props1), /*#__PURE__*/_react.default.createElement(_reactVueLike.default.Directive, {
      _source: "span",
      _bindings: [{
        name: "test",
        arg: "dd",
        modifiers: {
          aa: true,
          bb: true
        },
        expression: "[1,'2',true, null, undefined,\n        new Date(1, a), new RegExp(), /dd/i, this.vif, {}, [],\n        fun(), (function func1(aa = {}, { dd: cc }, [ dd = 1 ]){ let ee = 1, rr; }), ...ddd,\n        a > c ? (b - 1) : (c + 1 ? (c || d ? e ^ d : 11) : true),\n        !d, i++, --i,\n        { [dd]: 1, cc: 2, get ee(){}, set ee(v){}, rr(){} },\n        `11${1}22${3}44`",
        value: [1, '2', true, null, undefined, new Date(1, a), new RegExp(), /dd/i, this.vif, {}, [], fun(), function func1() {
          let aa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          let _ref = arguments.length > 1 ? arguments[1] : undefined,
              cc = _ref.dd;

          let _ref2 = arguments.length > 2 ? arguments[2] : undefined,
              _ref3 = _slicedToArray(_ref2, 1),
              _ref3$ = _ref3[0],
              dd = _ref3$ === void 0 ? 1 : _ref3$;

          let ee = 1,
              rr;
        }].concat(_toConsumableArray(ddd), [a > c ? b - 1 : c + 1 ? c || d ? e ^ d : 11 : true, !d, i++, --i, {
          [dd]: 1,
          cc: 2,

          get ee() {},

          set ee(v) {},

          rr() {}

        }, `11${1}22${3}44`])
      }]
    }), /*#__PURE__*/_react.default.createElement(_reactVueLike.default.Directive, {
      _source: Test2,
      _bindings: [{
        name: "test2",
        arg: "",
        modifiers: {},
        expression: "{ aa: 1 }",
        value: {
          aa: 1
        }
      }]
    }));
  }

}

var _default = App;
exports.default = _default;