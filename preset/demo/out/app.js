"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.regexp.constructor");

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

require("somescss?react-vue-like&scoped=true&id=data-v-4167244a");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function Test() {
  return _react.default.createElement("div", null);
}

function Test2() {
  return _react.default.createElement("div", null);
}

var _dirname = '1';

var App =
/*#__PURE__*/
function (_ReactVueLike) {
  _inherits(App, _ReactVueLike);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      var _this = this,
          _ee,
          _ee2,
          _ref4,
          _mutatorMap;

      // let lan;
      return _react.default.createElement("div", {
        class: "root",
        className: "data-v-4167244a"
      }, this.vif ? _react.default.createElement("span", {
        className: "data-v-4167244a dddd"
      }, "v-if showing") : null, _react.default.createElement("span", {
        className: "data-v-4167244a" + ' ' + ('aa' + ' bb'),
        "v-show": this.vif && this.vshow,
        style: {
          display: 'none'
        }
      }, "v-show showing"), _react.default.createElement("input", {
        className: "data-v-4167244a" + ' ' + callFunc(),
        value: this.formData.text,
        onChange: function onChange(e) {
          _this.formData.text = e.target.value;
        }
      }), _react.default.createElement("input", {
        value: this.formData.text1,
        onChange: function onChange(e) {
          (function (e) {
            _this.formData.text1 = e.target.value;
          })(e);

          (function (a) {
            return console.log(a);
          })(e);
        },
        className: "data-v-4167244a"
      }), _react.default.createElement("ReactVueLike.Directive", {
        className: "data-v-4167244a",
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
            var aa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _ref = arguments.length > 1 ? arguments[1] : undefined,
                cc = _ref.dd;

            var _ref2 = arguments.length > 2 ? arguments[2] : undefined,
                _ref3 = _slicedToArray(_ref2, 1),
                _ref3$ = _ref3[0],
                dd = _ref3$ === void 0 ? 1 : _ref3$;

            var ee = 1,
                rr;
          }].concat(_toConsumableArray(ddd), [a > c ? b - 1 : c + 1 ? c || d ? e ^ d : 11 : true, !d, i++, --i, (_ref4 = {}, _defineProperty(_ref4, dd, 1), _defineProperty(_ref4, "cc", 2), _ee = "ee", _mutatorMap = {}, _mutatorMap[_ee] = _mutatorMap[_ee] || {}, _mutatorMap[_ee].get = function () {}, _ee2 = "ee", _mutatorMap[_ee2] = _mutatorMap[_ee2] || {}, _mutatorMap[_ee2].set = function (v) {}, _defineProperty(_ref4, "rr", function rr() {}), _defineEnumerableProperties(_ref4, _mutatorMap), _ref4), "11".concat(1, "22", 3, "44")])
        }]
      }), _react.default.createElement(Test, {
        dd: "1",
        className: "data-v-4167244a"
      }), _react.default.createElement("ReactVueLike.Directive", {
        className: "data-v-4167244a",
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
      }), _react.default.createElement("span", {
        className: "data-v-4167244a"
      }, " dd ", this._resolveFilter(function () {
        return _this.$filters.dd.call(null, dd);
      }, 'dd'), " dd "), _react.default.createElement("span", {
        a: 11 | cc,
        className: "data-v-4167244a"
      }, " aa ", this._resolveFilter(function () {
        return _this.$filters.aa.bb.cc.call(null, [2, 123, 333]);
      }, 'aa.bb.cc'), " bb ", this._resolveFilter(function () {
        return _this.$filters.dd.cc.ee.call(null, [11]);
      }, 'dd.cc.ee'), " ", this._resolveFilter(function () {
        return _this.$filters.aa.bb.cc.dd.call(null, [22, 11]);
      }, 'aa.bb.cc.dd'), " ", this._resolveFilter(function () {
        return _this.$filters.bb.call(null, [33, bb]);
      }, 'bb'), " bb ", this._resolveFilter(function () {
        return _this.$filters.dd.call(null, 44);
      }, 'dd')));
    }
  }], [{
    key: "data",
    value: function data() {
      return {
        __dirname: "/preset/demo/src",
        dirname: a.__dirname,
        filename: "/preset/demo/src/app.js",
        now: "2019-09-04 14:52:03",
        vif: true,
        vshow: true,
        formData: {
          text: 'aaa'
        },
        languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Scala']
      };
    }
  }]);

  return App;
}(_reactVueLike.default);

App.__file = __filename;
App.__scopeId = "data-v-4167244a";
var _default = App;
exports.default = _default;