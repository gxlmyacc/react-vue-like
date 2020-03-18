"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.set-prototype-of");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
      var _this = this;

      return _react.default.createElement("div", {
        className: "root"
      }, _react.default.createElement("span", null, " dd ", this._f(function () {
        return _this.$filters.dd.call(null, dd);
      }, 'dd'), " dd "), _react.default.createElement("span", {
        a: 11 | cc
      }, "aa", this._f(function () {
        return _this.$filters.aa.bb.cc.apply(null, [2, 123, 333]);
      }, 'aa.bb.cc'), "bb", this._f(function () {
        return _this.$filters.dd.cc.ee.apply(null, [11]);
      }, 'dd.cc.ee'), this._f(function () {
        return _this.$filters.aa.bb.cc.dd.apply(null, [22, 11]);
      }, 'aa.bb.cc.dd'), this._f(function () {
        return _this.$filters.bb.apply(null, [33, bb]);
      }, 'bb'), "bb", this._f(function () {
        return _this.$filters.dd.call(null, 44);
      }, 'dd')));
    }
  }], [{
    key: "data",
    value: function data() {
      return {};
    }
  }]);

  return App;
}(ReactVueLike);

App.__vuelike = true;
App.__file = "/preset/demo/src/filter.js";
var _default = App;
exports.default = _default;