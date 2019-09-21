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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Directive extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false
    };
  }

  componentDidMount() {
    var _this = this;

    (0, _utils.iterativeParent)(this, function (parent) {
      return _this.$parent = parent;
    }, _component.default);
    if (!this.$parent) throw new Error('[ReactVueLike error]: can not find directive parent component');

    const _pending = function _pending() {
      _this.$directives = _this.$parent.$directives;

      _this._call('bind');

      _this._mountPending = function () {
        _this._mountPending = null;

        _this._call('insert');
      };

      _this.setState({
        isMounted: true
      });
    };

    if (this.$parent._isWillMount) _pending();else this.$parent._mountedPending.push(_pending);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this._mountPending) this._mountPending();else this._call('componentUpdated');
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this._call('update');

    return null;
  }

  componentWillUnmount() {
    this._call('unbind');
  }

  _call(eventName) {
    var _this2 = this;

    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var el;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            el = _reactDom.default.findDOMNode(_this2);

            _this2.props._bindings.forEach(function (binding) {
              let d = _this2.$directives[binding.name];
              if (!d) throw new Error(`directive '${binding.name}' not be found!`);
              let event = d[eventName];
              if (!event) return;
              if (_config.default.enforceActions) event = (0, _mobx.action)(event);
              event.call(_this2.$parent, el, binding, _this2._reactInternalFiber);
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }

  render() {
    if (!this.state.isMounted) return null; // eslint-disable-next-line

    const _this$props = this.props,
          _source = _this$props._source,
          _bindings = _this$props._bindings,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["_source", "_bindings", "children"]);

    if (typeof _source === 'string') return _react.default.createElement(_source, Object.assign(props, {
      ref: this.$ref
    }), children);
  }

}

_defineProperty(Directive, "propTypes", {
  _source: _propTypes.default.oneOfType([_propTypes.default.string.isRequired, _propTypes.default.elementType.isRequired]),
  _bindings: _propTypes.default.array.isRequired
});

var _default = Directive;
exports.default = _default;