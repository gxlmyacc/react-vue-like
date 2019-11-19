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
      onUpdateAa: this._resolveAction(function (v) {
        _this.aa = v;
      })
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        $event.stopPropagation();
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        $event.preventDefault();
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClickCapture: this.test
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if ($event.target !== $event.currentTarget) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        $event = $event.nativeEvent;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && _reactVueLike.default._k.call(_this, $event.keyCode, "once", {}, $event.key)) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && $event.keyCode !== 37) return null;
        if ('button' in $event && $event.button !== 0) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && $event.keyCode !== 39) return null;
        if ('button' in $event && $event.button !== 2) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if ('button' in $event && $event.button !== 1) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && _reactVueLike.default._k.call(_this, $event.keyCode, "passive", {}, $event.key)) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && $event.keyCode !== 13) return null;
        return _this.test($event);
      }
    }), _react.default.createElement("div", {
      onClick: function onClick($event) {
        if (!('button' in $event) && $event.keyCode !== 13) return null;
        return _this.test($event);
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
