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
    return {};
  }

  cc() {
    return _react.default.createElement("div", {
      className: "test"
    });
  }

  render() {
    var _this = this;

    let a = true; // let ret = () => <div></div>;

    let ret = function ret() {
      return _react.default.createElement("div", this._resolveSpreadAttrs("div", {}));
    };

    if (a) {
      ret = function ret() {
        console.log('ddd');
        return _react.default.createElement("span", _this._resolveSpreadAttrs("span", {}));
      };
    } // else ret = () => <p></p>;


    console.log('ddd', ret);
    return ret(); // return this.cc();
    // return a && <div>dd</div>
  }

}

App.__file = "/preset/demo/src/attrs.js";
App.__flows = [];

_defineProperty(App, "methods", {
  dd() {
    return _react.default.createElement("div", {
      className: "test"
    });
  }

});

var _default = App;
exports.default = _default;