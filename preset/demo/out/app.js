"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

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
      return _react.default.createElement("div", {
        className: "root"
      }, _react.default.createElement("span", {
        className: "app-window-icon",
        onClick: this.windowMax,
        style: {
          display: !this.isWindowMax ? null : "none"
        }
      }, "1"), _react.default.createElement("span", {
        className: "app-window-icon",
        onClick: this.windowRestore,
        style: {
          display: this.isWindowMax ? null : "none"
        }
      }, "2"));
    }
  }], [{
    key: "data",
    value: function data() {
      var namespace = "react-vue-like".match(/\/?([0-9a-z-]+)$/)[1];
      return {
        __dirname: "/preset/demo/src",
        dirname: a.__dirname,
        filename: "/preset/demo/src/app.js",
        now: "2019-11-27 18:40:22",
        vif: true,
        vshow: true,
        formData: {
          text: 'aaa'
        },
        namespace: namespace,
        languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Scala']
      };
    }
  }]);

  return App;
}(_reactVueLike.default);

App.__file = "/preset/demo/src/app.js";
var _default = App;
exports.default = _default;