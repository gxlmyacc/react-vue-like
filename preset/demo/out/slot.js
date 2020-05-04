"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends ReactVueLike.Component {
  static data() {
    return {
      header: true,
      body: true,
      footer: true
    };
  }

  render() {
    let a = [1, 2, 3];
    console.log(a);
    return _react.default.createElement("div", null, this.header ? _react.default.createElement("slot", {
      className: "11",
      $slotFn: this._resolveSlot
    }, "ddd", _react.default.createElement("div", null, "slot text")) : null, _react.default.createElement(SomeComp, {
      $slots: {
        footer: this.footer ? _react.default.createElement("div", null) : null,
        body: function body(_ref) {
          let item = _ref.item;
          return _react.default.createElement("div", {
            name: item.name
          });
        },
        header: _react.default.createElement("div", null)
      }
    }));
  }

}

App.__file = "/preset/demo/src/slot.js";

_defineProperty(App, "inheritAttrs", true);

_defineProperty(App, "methods", {});

var _default = App;
exports.default = _default;