"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _mobx = require("./mobx");

var _component = _interopRequireDefault(require("./component"));

var _config = _interopRequireDefault(require("./config"));

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

var Directive =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Directive, _React$Component);

  function Directive(props) {
    var _this;

    _classCallCheck(this, Directive);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Directive).call(this, props));
    _this.state = {
      isMounted: false
    };
    return _this;
  }

  _createClass(Directive, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      (0, _utils.iterativeParent)(this, function (parent) {
        return _this2.$parent = parent;
      }, _component.default);
      if (!this.$parent) throw new Error('[ReactVueLike error]: can not find directive parent component');

      var _pending = function _pending() {
        _this2.$directives = _this2.$parent.$directives;

        _this2._call('bind');

        _this2._mountPending = function () {
          _this2._mountPending = null;

          _this2._call('insert');
        };

        _this2.setState({
          isMounted: true
        });
      };

      if (this.$parent._isWillMount) _pending();else this.$parent._mountedPending.push(_pending);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (this._mountPending) this._mountPending();else this._call('componentUpdated');
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps, prevState) {
      this._call('update');

      return null;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._call('unbind');
    }
  }, {
    key: "_call",
    value: function () {
      var _call2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(eventName) {
        var _this3 = this;

        var el;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                el = _reactDom.default.findDOMNode(this);

                this.props._bindings.forEach(function (binding) {
                  var d = _this3.$directives[binding.name];
                  if (!d) throw new Error("directive '".concat(binding.name, "' not be found!"));
                  var event = d[eventName];
                  if (!event) return;
                  if (_config.default.enforceActions) event = (0, _mobx.action)(event);
                  event.call(_this3.$parent, el, binding, _this3._reactInternalFiber);
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _call(_x) {
        return _call2.apply(this, arguments);
      }

      return _call;
    }()
  }, {
    key: "render",
    value: function render() {
      if (!this.state.isMounted) return null; // eslint-disable-next-line

      var _this$props = this.props,
          _source = _this$props._source,
          _bindings = _this$props._bindings,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["_source", "_bindings", "children"]);

      if (typeof _source === 'string') return _react.default.createElement(_source, Object.assign(props, {
        ref: this.$ref
      }), children);
    }
  }]);

  return Directive;
}(_react.default.Component);

_defineProperty(Directive, "propTypes", {
  _source: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]),
  _bindings: _propTypes.default.array.isRequired
});

var _default = Directive;
exports.default = _default;