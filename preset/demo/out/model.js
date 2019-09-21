"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _reactVueLike.default {
  render() {
    var _this = this;

    return _react.default.createElement("div", {
      className: "root"
    }, _react.default.createElement("input", {
      add: "",
      value: _this.formData.text,
      onChange: this._resolveEvent(function (e) {
        _this.formData.text = e && e.target ? e.target.value : e;
      })
    }), _react.default.createElement("input", {
      value: _this.formData.text,
      onBlur: this._resolveEvent(function (e) {
        _this.formData.text = e && e.target ? e.target.value : e;
      })
    }), _react.default.createElement("input", {
      value: _this.formData.text,
      onBlur: this._resolveEvent(function (e) {
        _this.formData.text = Number(e && e.target ? e.target.value : e);
      })
    }), _react.default.createElement("input", {
      value: _this.formData.text1,
      onChange: function onChange(e) {
        _this._resolveEvent(function (e) {
          _this.formData.text1 = ((e && e.target ? e.target.value : e) || '').trim();
        })(e);

        (function (a) {
          return console.log(a);
        })(e);
      }
    }));
  }

}

App.__file = "/preset/demo/src/model.js";
var _default = App;
exports.default = _default;