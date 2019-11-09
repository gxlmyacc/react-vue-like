"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./index.scss?react-vue-like&scoped=true&id=v-0774b24c");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends ReactVueLike {
  undefined(props) {
    super(props);
  }

  static data() {
    return {};
  }

  cc() {
    return _react.default.createElement("div", {
      className: "v-0774b24c test"
    });
  }

  render() {
    let a = true;

    let ret = _react.default.createElement("div", {
      className: "v-0774b24c"
    });

    if (a) ret = _react.default.createElement("span", {
      className: "v-0774b24c"
    });else ret = _react.default.createElement("p", {
      className: "v-0774b24c"
    });
    console.log('ddd', ret);
    return ret; // return this.cc();
    // return a && <div>dd</div>
  }

}

App.__file = "/preset/demo/src/scope.js";

_defineProperty(App, "methods", {
  dd() {
    return _react.default.createElement("div", {
      className: "v-0774b24c test"
    });
  }

});

var _default = App;
exports.default = _default;