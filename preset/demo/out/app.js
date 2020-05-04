"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

var _reactViewRouter = require("react-view-router");

var _dpl = require("dpl");

var _bodyLoading = _interopRequireDefault(require("@/components/common/body-loading"));

var _history = _interopRequireDefault(require("@/history"));

var _vuelike = _interopRequireDefault(require("@/vuelike"));

require("./app-index.scss?react-vue-like&scoped=true&id=v-9dbd2aa8");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AppIndex extends _reactVueLike.default.Component {
  mounted() {
    this.init();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "v-9dbd2aa8 app-index"
    }, /*#__PURE__*/_react.default.createElement(_bodyLoading.default, {
      className: "v-9dbd2aa8",
      store: this.$store
    }), /*#__PURE__*/_react.default.createElement(_reactViewRouter.RouterView, {
      className: "v-9dbd2aa8",
      router: _history.default,
      fallback: /*#__PURE__*/_react.default.createElement(_dpl.Loading, {
        className: "v-9dbd2aa8 dpl-embed-loading",
        showMask: true,
        text: "\u52A0\u8F7D\u4E2D",
        visible: true
      })
    }));
  }

}

AppIndex.__file = "/preset/demo/src/app.js";

_defineProperty(AppIndex, "isRoot", _vuelike.default);

_defineProperty(AppIndex, "computed", {
  account() {
    return this.$store.state.account;
  },

  customer() {
    return this.$store.state.customer;
  },

  customerList() {
    return this.$store.state.customerList;
  }

});

_defineProperty(AppIndex, "methods", {
  init() {}

});

AppIndex.__vuelike = true;
var _default = AppIndex;
exports.default = _default;