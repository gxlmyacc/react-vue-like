"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _reactVueLike.default {
  static data() {
    return {
      list: [{
        key: 'a',
        value: 1
      }, {
        key: 'b',
        value: 2
      }, {
        key: 'c',
        value: 3
      }]
    };
  }

  render() {
    var _this = this;

    return _react.default.createElement("div", {
      className: "root",
      ref: function ref(el) {
        return _this._resolveRef("container", el, undefined);
      }
    }, this.list.map(function (v, $index) {
      return [_react.default.createElement("span", {
        ref: function ref(el) {
          return _this._resolveRef("item1", el, $index);
        },
        key: v.key
      }, v.value), // <span ref:key="item2" key={v.key}>{v.value}</span>,
      _react.default.createElement("span", {
        ref: function ref(el) {
          return _this._resolveRef("item2", el, String(v.key));
        },
        key: v.key
      }, v.value)];
    }));
  }

}

App.__file = "/preset/demo/src/ref.js";
var _default = App;
exports.default = _default;