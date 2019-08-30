"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.promise");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _utils = require("./utils");

var _config2 = _interopRequireDefault(require("./config"));

var _propCheck = _interopRequireDefault(require("./prop-check"));

var _class, _class2, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateComputed(obj) {
  var ret = {};
  Object.keys(obj).forEach(function (key) {
    var v = obj[key];
    if ((0, _utils.isFunction)(v)) return (0, _utils.defComputed)(ret, key, v);
    (0, _utils.defComputed)(ret, key, v.get, v.set);
  });
  return ret;
}

function bindMethods(ctx, methods) {
  methods && Object.keys(methods).forEach(function (key) {
    return ctx[key] = methods[key].bind(ctx);
  });
}

function bindWatch(ctx, watch) {
  if (!watch) return;
  Object.keys(watch).forEach(function (key) {
    return ctx.$watch(key, watch[key]);
  });
}

var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'errorCaptured'];
var RGEX_EVENT = /on([A-Z]\w+)/; // const RGEX_SYNC = /^(\w+)\$sync$/;

function initListeners(ctxs, props) {
  var listeners = {};

  var addListener = function addListener(key, handler) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(handler);
  };

  ctxs.forEach(function (ctx) {
    LIFECYCLE_HOOKS.forEach(function (key) {
      var name = "hook:".concat(key);
      var handler = ctx[key];
      if (!handler && ctx.prototype && ctx.prototype[key]) handler = ctx.prototype[key];
      if (handler) addListener(name, handler);
    });
  });

  if (props) {
    Object.keys(props).forEach(function (key) {
      var handler = props[key];
      if (!handler) return;

      var _ref = key.match(RGEX_EVENT) || [],
          _ref2 = _slicedToArray(_ref, 2),
          eventName = _ref2[1];

      if (eventName) addListener((0, _utils.camelize)(eventName), handler);
    });
  }

  return listeners;
}

var ReactVueLike = (0, _mobxReact.observer)(_class = (_temp = _class2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReactVueLike, _React$Component);

  function ReactVueLike(_props) {
    var _this;

    _classCallCheck(this, ReactVueLike);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactVueLike).call(this, _props));
    var target = this instanceof ReactVueLike ? this.constructor : void 0;
    var mixins = target.mixins,
        isRoot = target.isRoot,
        inherits = target.inherits;
    if (isRoot) _this._isVueLikeRoot = true;
    _this._isVueLike = true;
    _this._type = target;
    _this._ticks = [];
    _this._provides = [];
    _this._injects = [];
    _this._inherits = null;
    _this._el = null;
    _this.$refs = {};
    _this.$parent = null;
    _this.$root = null;
    _this.$children = [];
    (0, _utils.defComputed)(_assertThisInitialized(_this), '$el', function () {
      return _this._el || (_this._el = _reactDom.default.findDOMNode(_assertThisInitialized(_this)));
    }, function (v) {
      throw new Error('ReactVueLike error: $el is readonly!');
    });
    _this._renderFn = _this.render;
    _this.render = ReactVueLike.prototype.render;
    var inheritsKeys = inherits && Object.keys(inherits);

    if (inheritsKeys.length) {
      _this._inherits = {};
      inheritsKeys.forEach(function (key) {
        return _this._inherits[key] = inherits[key];
      });
    }

    var ctxs = mixins ? [].concat(_toConsumableArray(ReactVueLike.mixins), _toConsumableArray(mixins), [target]) : [].concat(_toConsumableArray(ReactVueLike.mixins), [target]);
    _this.$listeners = initListeners(ctxs, _props);

    _this.$emit('hook:beforeCreate', _props);

    var _data = {};
    var _computed = {};
    var _methods = {};
    var _watch = {};
    ctxs.forEach(function (ctx) {
      if (ctx.data) Object.assign(_data, ctx.data.call(_assertThisInitialized(_this), _props));
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) _this._provides.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(function (key) {
        return !_this._injects.includes(key) && _this._injects.push(key);
      });
    });
    _this.$data = _data;
    var _deeps = {};
    var _shadows = {};
    Object.keys(_data).forEach(function (key) {
      if (key.startsWith('_')) _shadows[key] = _data[key];else _deeps[key] = _data[key];
    });
    (0, _mobx.extendObservable)(_assertThisInitialized(_this), _deeps, {}, {
      deep: true
    });
    (0, _mobx.extendObservable)(_assertThisInitialized(_this), _shadows, {}, {
      deep: false
    });
    (0, _mobx.extendObservable)(_assertThisInitialized(_this), generateComputed(_computed));
    bindMethods(_assertThisInitialized(_this), _methods);
    var pMethods = {};
    Object.getOwnPropertyNames(target.prototype).filter(function (key) {
      return ReactVueLike.prototype[key];
    }).map(function (key) {
      return (0, _utils.isFunction)(_this[key]) && (pMethods[key] = _this[key]);
    });
    bindMethods(_assertThisInitialized(_this), pMethods);
    bindWatch(_assertThisInitialized(_this), _watch);

    _this.$emit('hook:created');

    _this.$emit('hook:beforeMount');

    return _this;
  }

  _createClass(ReactVueLike, [{
    key: "_resolveParent",
    value: function _resolveParent() {
      var _this2 = this;

      if (!this._isVueLikeRoot) {
        (0, _utils.iterativeParent)(this, function (parent) {
          return _this2.$parent = parent;
        }, ReactVueLike);

        if (this.$parent) {
          this.$parent.$children.push(this);

          if (this.$parent._inherits) {
            if (!this._inherits) this._inherits = {};
            Object.assign(this._inherits, this.$parent._inherits);
          }
        }
      }

      this.$root = this.$parent ? this.$parent.$root : this;
      if (this._inherits) Object.assign(this, this._inherits);
    }
  }, {
    key: "_resolveInject",
    value: function _resolveInject() {
      var _this3 = this;

      try {
        var injects = this._injects;

        var getProvides = function getProvides(vm) {
          var provides = vm && vm._provides;
          if (!provides || !provides.length) return;
          var ret = {};
          provides.forEach(function (p) {
            return Object.assign(ret, (0, _utils.isFunction)(p) ? p.call(vm) : p);
          });
          return ret;
        };

        if (injects.length) {
          (0, _utils.iterativeParent)(this, function (vm) {
            var _provide = getProvides(vm);

            if (_provide) {
              for (var i = injects.length - 1; i; i--) {
                var key = injects[i];
                var v = _provide[key];

                if (v !== undefined) {
                  _this3.$set(_this3, key, v);

                  injects.splice(i, 1);
                }
              }
            }

            return !injects.length;
          }, ReactVueLike);
        }
      } catch (e) {
        (0, _utils.handleError)(e, this, 'resolveInject');
        throw e;
      }
    }
  }, {
    key: "_resolveUpdated",
    value: function _resolveUpdated() {
      this._el = null;
    }
  }, {
    key: "_resolveDestory",
    value: function _resolveDestory() {
      var _this4 = this;

      this._flushTicks();

      if (this.$parent) {
        var idx = this.$parent.$children.findIndex(function (c) {
          return c === _this4;
        });
        if (~idx) this.$parent.$children.splice(idx, 1);
      }
    }
  }, {
    key: "_flushTicks",
    value: function _flushTicks() {
      if (!this._ticks.length) return;

      var ticks = this._ticks.slice();

      this._ticks = [];
      setTimeout(function () {
        return ticks.forEach(function (v) {
          return v();
        });
      }, 0);
    }
  }, {
    key: "_callListener",
    value: function () {
      var _callListener2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(eventName, handlers, args) {
        var ret, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, handler;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (handlers) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                if (!(0, _utils.isFunction)(handlers)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return handlers.call.apply(handlers, [this].concat(_toConsumableArray(args)));

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 10;
                _iterator = handlers[Symbol.iterator]();

              case 12:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 20;
                  break;
                }

                handler = _step.value;
                _context.next = 16;
                return handler.call.apply(handler, [this].concat(_toConsumableArray(args)));

              case 16:
                ret = _context.sent;

              case 17:
                _iteratorNormalCompletion = true;
                _context.next = 12;
                break;

              case 20:
                _context.next = 26;
                break;

              case 22:
                _context.prev = 22;
                _context.t0 = _context["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 26:
                _context.prev = 26;
                _context.prev = 27;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 29:
                _context.prev = 29;

                if (!_didIteratorError) {
                  _context.next = 32;
                  break;
                }

                throw _iteratorError;

              case 32:
                return _context.finish(29);

              case 33:
                return _context.finish(26);

              case 34:
                return _context.abrupt("return", ret);

              case 37:
                _context.prev = 37;
                _context.t1 = _context["catch"](0);
                (0, _utils.handleError)(_context.t1, this, "$emit:".concat(eventName));
                throw _context.t1;

              case 41:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 37], [10, 22, 26, 34], [27,, 29, 33]]);
      }));

      function _callListener(_x, _x2, _x3) {
        return _callListener2.apply(this, arguments);
      }

      return _callListener;
    }()
  }, {
    key: "beforeCreate",
    value: function beforeCreate() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    }
  }, {
    key: "created",
    value: function created() {}
  }, {
    key: "beforeMount",
    value: function beforeMount() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    }
  }, {
    key: "mounted",
    value: function mounted() {}
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate() {}
  }, {
    key: "updated",
    value: function updated() {}
  }, {
    key: "beforeDestory",
    value: function beforeDestory() {}
  }, {
    key: "errorCaptured",
    value: function errorCaptured(err, vm, info) {} // $mount(elementOrSelector) {
    //   if (!elementOrSelector) throw new Error('$mount error: elementOrSelector can not be null!');
    //   let el;
    //   if (typeof elementOrSelector === 'string') el = document.getElementById(elementOrSelector);
    //   else if (elementOrSelector instanceof Element) el = elementOrSelector;
    //   else throw new Error(`$mount error: elementOrSelector ${elementOrSelector} is not support type!`);
    //   ReactDOM.render(<App />, el);
    // }

  }, {
    key: "$nextTick",
    value: function $nextTick(cb, ctx) {
      this._ticks.push(ctx ? cb.bind(ctx) : cb);
    }
  }, {
    key: "$watch",
    value: function $watch(expOrFn, callback) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!expOrFn || !callback) return;
      callback = callback.bind(this);

      if (typeof expOrFn === 'string') {
        var _parseExpr = (0, _utils.parseExpr)(this, expOrFn),
            obj = _parseExpr.obj,
            key = _parseExpr.key;

        if (obj && key) {
          return (0, _mobx.observe)(obj, key, function (change) {
            return callback(change.newValue, change.oldValue);
          }, options.immediate);
        }
      } else if ((0, _utils.isFunction)(expOrFn)) {
        var oldValue;
        return (0, _mobx.when)(function () {
          return oldValue !== expOrFn();
        }, callback);
      }
    }
  }, {
    key: "$set",
    value: function $set(target, expr, value) {
      var _parseExpr2 = (0, _utils.parseExpr)(target, expr),
          obj = _parseExpr2.obj,
          key = _parseExpr2.key;

      if (obj && key) (0, _mobx.set)(obj, key, value);
    }
  }, {
    key: "$delete",
    value: function $delete(target, expr) {
      var _parseExpr3 = (0, _utils.parseExpr)(target, expr),
          obj = _parseExpr3.obj,
          key = _parseExpr3.key;

      if (obj && key) (0, _mobx.remove)(obj, key);
    }
  }, {
    key: "$emit",
    value: function $emit(eventName) {
      eventName = (0, _utils.camelize)(eventName);

      for (var _len = arguments.length, payload = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        payload[_key - 1] = arguments[_key];
      }

      return this._callListener(eventName, this.$listeners[eventName], payload);
    }
  }, {
    key: "$on",
    value: function $on(eventName, handler) {
      eventName = (0, _utils.camelize)(eventName);
      if (!this.$listeners[eventName]) this.$listeners[eventName] = [];
      this.$listeners[eventName].push(handler.bind(this));
    }
  }, {
    key: "$off",
    value: function $off(eventName, handler) {
      eventName = (0, _utils.camelize)(eventName);

      if (handler) {
        var handlers = this.$listeners[eventName];

        if (handlers) {
          var idx = handlers.findIndex(function (v) {
            return v === handler;
          });
          if (~idx) handlers.splice(idx, 1);
        }

        return;
      }

      delete this.$listeners[eventName];
    }
  }, {
    key: "$once",
    value: function $once(eventName, handler) {
      var _this5 = this;

      eventName = (0, _utils.camelize)(eventName);

      this.$listeners[eventName] = function () {
        _this5.$off(eventName, handler);

        for (var _len2 = arguments.length, payload = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          payload[_key2] = arguments[_key2];
        }

        return handler.call.apply(handler, [_this5].concat(payload));
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this._renderFn && this._renderFn.apply(this, arguments);
    }
  }, {
    key: "getSnapshotBeforeUpdate",
    value: function getSnapshotBeforeUpdate(prevProps, prevState) {
      this.$emit('hook:beforeUpdate');
      return null;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this._reactInternalFiber) {
        this._resolveParent();

        this._resolveInject();
      }

      this.$emit('hook:mounted');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      this._resolveUpdated();

      this.$emit('hook:updated');

      this._flushTicks();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.$emit('hook:beforeDestory');

      this._resolveDestory();
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      this.$emit('hook:errorCaptured', error, this, info);
    }
  }], [{
    key: "use",
    value: function use(plugin) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!plugin.install) throw Error('ReactVueLike.use error: plugin need has \'install\' method!');
      plugin.install(ReactVueLike, options);
    }
  }, {
    key: "config",
    value: function config() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.assign(_config2.default, options);
    }
  }, {
    key: "mixin",
    value: function mixin(m) {
      if (!m) return;
      ReactVueLike.mixins.push(m);
    }
  }, {
    key: "data",
    value: function data(props) {
      return {};
    }
  }, {
    key: "provide",
    value: function provide() {}
  }]);

  return ReactVueLike;
}(_react.default.Component), _defineProperty(_class2, "inherits", {}), _defineProperty(_class2, "props", {}), _defineProperty(_class2, "mixins", []), _defineProperty(_class2, "inject", []), _defineProperty(_class2, "computed", {}), _defineProperty(_class2, "watch", {}), _defineProperty(_class2, "methods", {}), _temp)) || _class;

ReactVueLike.config.optionMergeStrategies = {};
ReactVueLike.Component = ReactVueLike;

function ReactHook() {
  var _createElement = _react.default.createElement;

  _react.default.createElement = function createElement(Component) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    if (!Component || !Component.props) return _createElement.call.apply(_createElement, [this, Component].concat(args)); // eslint-disable-next-line

    if (!Component.propTypes && Component.prototype instanceof ReactVueLike) {
      Component = (0, _propCheck.default)(Component);
      if (Component.beforeConstructor) Component.beforeConstructor(Component);
    }

    return _createElement.call.apply(_createElement, [this, Component].concat(args));
  };
}

ReactHook();
var _default = ReactVueLike;
exports.default = _default;