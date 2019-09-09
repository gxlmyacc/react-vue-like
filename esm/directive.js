"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.set-prototype-of");

require("regenerator-runtime/runtime");

var _react = _interopRequireDefault(require("react"));

var _component = _interopRequireDefault(require("./component"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var ReactVueLikeDirective =
/*#__PURE__*/
function (_ReactVueLike) {
  _inherits(ReactVueLikeDirective, _ReactVueLike);

  function ReactVueLikeDirective() {
    _classCallCheck(this, ReactVueLikeDirective);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReactVueLikeDirective).apply(this, arguments));
  }

  _createClass(ReactVueLikeDirective, [{
    key: "_callDirective",
    value: function () {
      var _callDirective2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(eventName) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                this.props._bindings.forEach(function (binding) {
                  var d = _this.$directives[binding.name];
                  if (!d) throw new Error("directive '".concat(binding.name, "' not be found!"));
                  if (!d[eventName]) return;
                  d[eventName].call(_this.$parent, _this.$el, binding, _this._reactInternalFiber);
                });

                _context.next = 8;
                break;

              case 4:
                _context.prev = 4;
                _context.t0 = _context["catch"](0);
                (0, _utils.handleError)(_context.t0, this, "directive:".concat(eventName));
                throw _context.t0;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 4]]);
      }));

      function _callDirective(_x) {
        return _callDirective2.apply(this, arguments);
      }

      return _callDirective;
    }()
  }, {
    key: "mounted",
    value: function mounted() {
      this._callDirective('bind');

      this._callDirective('inserted');
    }
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate() {
      this._callDirective('update');
    }
  }, {
    key: "updated",
    value: function updated() {
      this._callDirective('componentUpdated');
    }
  }, {
    key: "beforeDestory",
    value: function beforeDestory() {
      this._callDirective('unbind');
    }
  }, {
    key: "render",
    value: function render() {
      // eslint-disable-next-line
      var _this$props = this.props,
          _source = _this$props._source,
          _bindings = _this$props._bindings,
          props = _objectWithoutProperties(_this$props, ["_source", "_bindings"]);

      var Source = _source;
      return _react.default.createElement(Source, props);
    }
  }]);

  return ReactVueLikeDirective;
}(_component.default);

ReactVueLikeDirective.__file = "/src/directive.js";

_defineProperty(ReactVueLikeDirective, "props", {
  _source: {
    // type: [String, Object],
    required: true
  },
  _bindings: {
    type: Array,
    required: true
  }
});

_defineProperty(ReactVueLikeDirective, "isAbstract", true);

var _default = ReactVueLikeDirective;
exports.default = _default;