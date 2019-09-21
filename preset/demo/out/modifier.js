"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireDefault(require("react-vue-like"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends _reactVueLike.default {
  render() {
    var _this = this;

    return _react.default.createElement("div", {
      className: "root"
    }, _react.default.createElement("div", {
      aa: _this.aa,
      onUpdateAa: this._resolveEvent(function (v) {
        _this.aa = v;
      })
    }), " */}", _react.default.createElement("div", {
      onClick: function onClick(_e) {
        _e.stopPropagation();

        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        _e.preventDefault();

        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClickCapture: this.test
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (_e.target !== _e.currentTarget) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        _e = _e.nativeEvent;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _reactVueLike.default._k.call(_this, _e.keyCode, "once", {}, _e.key)) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _e.keyCode !== 37) return null;
        if ('button' in _e && _e.button !== 0) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _e.keyCode !== 39) return null;
        if ('button' in _e && _e.button !== 2) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if ('button' in _e && _e.button !== 1) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _reactVueLike.default._k.call(_this, _e.keyCode, "passive", {}, _e.key)) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _e.keyCode !== 13) return null;
        return _this.test(_e);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick(_e) {
        if (!('button' in _e) && _e.keyCode !== 13) return null;
        return _this.test(_e);
      }
    }));
  }

}

App.__file = "/preset/demo/src/modifier.js";

_defineProperty(App, "methods", {
  test() {}

});

var _default = App;
exports.default = _default;