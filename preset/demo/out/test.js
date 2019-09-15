"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.weak-map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.set-prototype-of");

require("regenerator-runtime/runtime");

var _react = _interopRequireDefault(require("react"));

var _reactVueLike = _interopRequireWildcard(require("react-vue-like"));

var _router = _interopRequireDefault(require("router"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HomeMainSomeIndex =
/*#__PURE__*/
function (_ReactVueLike) {
  _inherits(HomeMainSomeIndex, _ReactVueLike);

  function HomeMainSomeIndex() {
    _classCallCheck(this, HomeMainSomeIndex);

    return _possibleConstructorReturn(this, _getPrototypeOf(HomeMainSomeIndex).apply(this, arguments));
  }

  _createClass(HomeMainSomeIndex, [{
    key: "render",
    value: function render() {
      var _this = this;

      return _react.default.createElement("div", null, _react.default.createElement("h1", null, "HomeMainSomeIndex"), this.text, _react.default.createElement("br", null), "logined: ", String(this.logined), _react.default.createElement("br", null), _react.default.createElement("input", {
        value: this.text,
        onChange: function onChange(e) {
          _this.text = e.target.value;
        }
      }), _react.default.createElement("button", {
        onClick: this.toggleLogin
      }, "toggle login"), _react.default.createElement("button", {
        onClick: this.testAsync
      }, "test async"), _react.default.createElement("button", {
        onClick: this.refresh
      }, "refresh"), _react.default.createElement("button", {
        onClick:
        /*#__PURE__*/
        _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  return _context.abrupt("return", _router.default.push('other'));

                case 1:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))
      }, "to other"));
    }
  }], [{
    key: "data",
    value: function data() {
      return {
        text: 'text1'
      };
    }
  }]);

  return HomeMainSomeIndex;
}(_reactVueLike.default);

HomeMainSomeIndex.__file = "/preset/demo/src/test.js";

_defineProperty(HomeMainSomeIndex, "computed", {
  logined: function logined() {
    return this.$store.state.logined;
  }
});

_defineProperty(HomeMainSomeIndex, "methods", {
  refresh: function refresh() {
    this.text = 'text1 refreshed';
  },
  toggleLogin: function toggleLogin() {
    this.$store.commit('update-logined', !this.logined);
  },
  delay: function delay() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        return resolve(timeout);
      }, timeout);
    });
  },
  testAsync:
  /*#__PURE__*/
  regeneratorRuntime.mark(function testAsync() {
    var i, timeout;
    return regeneratorRuntime.wrap(function testAsync$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            i = 0;
            console.log('testAsync', i);

          case 2:
            if (!(i <= 5)) {
              _context3.next = 11;
              break;
            }

            console.log('testAsync while', i);
            this.text = i++;
            _context3.next = 7;
            return this.delay(1000 + i);

          case 7:
            timeout = _context3.sent;
            console.log('timeout', timeout);
            _context3.next = 2;
            break;

          case 11:
            if (i > 4) {
              this.test = 'i > 4';
            }

            console.log('testAsync end', i);
            this.text = '完成';

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, testAsync, this);
  })
});

var test1 = (0, _reactVueLike.action)(function test1() {});
var test2 = (0, _reactVueLike.action)(
/*#__PURE__*/
regeneratorRuntime.mark(function test2() {
  return regeneratorRuntime.wrap(function test2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  }, test2);
})); // function WrapComponent(Comp) {
//   return React.forwardRef((props, ref) => (<Comp {...props} ref={ref} />));
// }

var _default = HomeMainSomeIndex;
exports.default = _default;