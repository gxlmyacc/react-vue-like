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

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

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

function generateComputed(obj, propData, data, target) {
  var _this = this;

  var ret = {};
  Object.keys(obj).forEach(function (key) {
    if (key in propData) {
      var e = new Error("key '".concat(key, "' in computed cannot be duplicated with props"));
      (0, _utils.handleError)(e, _this, "constructor:".concat(target.name));
      throw e;
    }

    if (key in data) {
      var _e = new Error("key '".concat(key, "' in computed cannot be duplicated with data()"));

      (0, _utils.handleError)(_e, _this, "constructor:".concat(target.name));
      throw _e;
    }

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

function parseProps(target, props, propTypes) {
  var propData = {};
  var attrs = {};
  if (!propTypes) propTypes = {};
  Object.keys(props).forEach(function (key) {
    if (propTypes[key]) propData[key] = props[key];
    if (['ref', 'children'].includes(key) || /^[$_]/.test(key)) return;

    if (target.inheritAttrs || target.inheritAttrs === undefined) {
      if (Array.isArray(target.inheritAttrs) && ~target.inheritAttrs.indexOf(key)) return;
      if (_config2.default.inheritAttrs.indexOf(key)) return;
    }

    attrs[key] = props[key];
  });
  return {
    propData: propData,
    attrs: attrs
  };
}

var ReactVueLike = (0, _mobxReact.observer)(_class = (_temp = _class2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReactVueLike, _React$Component);

  function ReactVueLike(_props) {
    var _this2;

    _classCallCheck(this, ReactVueLike);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ReactVueLike).call(this, _props));
    var target = this instanceof ReactVueLike ? this.constructor : void 0; // eslint-disable-next-line

    var propTypes = target.propTypes,
        mixins = target.mixins,
        isRoot = target.isRoot,
        isAbstract = target.isAbstract,
        inherits = target.inherits;
    if (isRoot) _this2._isVueLikeRoot = true;
    if (isAbstract) _this2._isVueLikeAbstract = true;

    var _parseProps = parseProps(target, _props, propTypes),
        propData = _parseProps.propData,
        attrs = _parseProps.attrs;

    _this2._isVueLike = true;
    _this2._type = target;
    _this2._ticks = [];
    _this2._provides = [];
    _this2._injects = [];
    _this2._inherits = null;
    _this2._el = null;
    _this2._mountedPending = [];
    _this2.$refs = {};
    _this2.$parent = null;
    _this2.$root = null;
    _this2.$children = [];
    _this2.$attrs = attrs;
    _this2.$slots = _props.$slots || {};
    (0, _mobx.extendObservable)(_assertThisInitialized(_this2), {
      _isWillMount: false,
      _isMounted: false
    });
    (0, _utils.defComputed)(_assertThisInitialized(_this2), '$el', function () {
      return _this2._el || (_this2._el = _reactDom.default.findDOMNode(_assertThisInitialized(_this2)));
    }, function (v) {
      throw new Error('ReactVueLike error: $el is readonly!');
    });
    _this2._renderFn = _this2.render;
    _this2.render = ReactVueLike.prototype.render;
    var inheritsKeys = inherits && Object.keys(inherits);

    if (inheritsKeys.length) {
      _this2._inherits = {};
      inheritsKeys.forEach(function (key) {
        return _this2._inherits[key] = inherits[key];
      });
    }

    var ctxs = mixins ? [].concat(_toConsumableArray(ReactVueLike.mixins), _toConsumableArray(mixins), [target]) : [].concat(_toConsumableArray(ReactVueLike.mixins), [target]);
    _this2.$listeners = initListeners(ctxs, _props);

    _this2.$emit('hook:beforeCreate', _props);

    var _data = {};
    var _computed = {};
    var _methods = {};
    var _watch = {};
    var _directives = {};
    var _filters = {};
    ctxs.forEach(function (ctx) {
      if (ctx.filters) Object.assign(_filters, ctx.filters);
      if (ctx.directives) Object.assign(_directives, ctx.directives);
      if (ctx.data) Object.assign(_data, ctx.data.call(_assertThisInitialized(_this2), _props));
      if (ctx.computed) Object.assign(_computed, ctx.computed);
      if (ctx.methods) Object.assign(_methods, ctx.methods);
      if (ctx.watch) Object.assign(_watch, ctx.watch);
      if (ctx.provide) _this2._provides.push(ctx.provide);
      if (ctx.inject) ctx.inject.forEach(function (key) {
        return !_this2._injects.includes(key) && _this2._injects.push(key);
      });
    });
    (0, _mobx.extendObservable)(_assertThisInitialized(_this2), propData);
    _this2.$filters = _filters;
    _this2.$directives = _directives;
    _this2.$data = _data;
    var deeps = {};
    var shadows = {};
    Object.keys(_data).forEach(function (key) {
      if (key in propData) {
        var e = new Error("key '".concat(key, "' in data() cannot be duplicated with props"));
        (0, _utils.handleError)(e, _assertThisInitialized(_this2), "constructor:".concat(target.name));
        throw e;
      }

      if (key.startsWith('_')) shadows[key] = _data[key];else deeps[key] = _data[key];
    });
    _this2._data = {
      deeps: deeps,
      shadows: shadows
    };
    bindMethods(_assertThisInitialized(_this2), _methods);
    var pMethods = {};
    Object.getOwnPropertyNames(target.prototype).filter(function (key) {
      return ReactVueLike.prototype[key];
    }).map(function (key) {
      return (0, _utils.isFunction)(_this2[key]) && (pMethods[key] = _this2[key]);
    });
    bindMethods(_assertThisInitialized(_this2), pMethods);
    _this2._computed = generateComputed(_computed, propData, _data, target);
    _this2._watch = _watch;
    Object.keys(_config2.default.inheritMergeStrategies).forEach(function (key) {
      var child = _this2._inherits[key];
      var parent = _this2[key];
      if (!parent) return;

      if (child) {
        var v = _config2.default.inheritMergeStrategies[key](parent, child, _assertThisInitialized(_this2), key);

        if (v !== undefined && v !== child) _this2._inherits[key] = v;
      } else _this2._inherits[key] = parent;
    });

    _this2.$emit('hook:created');

    return _this2;
  }

  _createClass(ReactVueLike, [{
    key: "_resolveRef",
    value: function _resolveRef(refName, el, key) {
      this.$refs[refName] = el; // if (!key) {
      //   this.$refs[refName] = el;
      //   return;
      // }
      // if (typeof key === 'number') {
      //   if (!this.$refs[refName]) this.$refs[refName] = [];
      //   this.$refs[refName][key] = el;
      //   return;
      // }
      // if (!this.$refs[refName]) this.$refs[refName] = {};
      // this.$refs[refName][key] = el;
    }
  }, {
    key: "_resolveSlot",
    value: function _resolveSlot(slotName, scope, children) {
      var slot = this.$slots[slotName];
      var ret;

      if (Array.isArray(slot)) {
        ret = slot.map(function (s, i) {
          return typeof s === 'function' ? s(scope) : s;
        });
        if (!ret.length) ret = null;
      } else ret = typeof slot === 'function' ? slot(scope) : slot;

      return ret || children;
    }
  }, {
    key: "_resolveSpreadAttrs",
    value: function _resolveSpreadAttrs(tagName, props) {
      var _this3 = this;

      if (this._type.inheritAttrs === false) return props;
      var inheritAttrs = Array.isArray(this._type.inheritAttrs) ? this._type.inheritAttrs : _config2.default.inheritAttrs;
      var RETX_DOM = /^[a-z]/;
      var attrs = {};
      var isPrimitiveTag = RETX_DOM.test(tagName);
      inheritAttrs.forEach(function (key) {
        var v = _this3.props[key];
        if ((0, _utils.isFalsy)(v)) return;
        if (key !== 'style' && isPrimitiveTag && !(0, _utils.isPrimitive)(v)) v = '';
        if (v === true) v = '';
        attrs[key] = v;
      });

      if (attrs.className && props.className && attrs.className !== props.className) {
        var ac = attrs.className.split(' ');
        var pc = props.className.split(' ');
        pc.forEach(function (c) {
          if (!c) return;
          if (~ac.indexOf(c)) return;
          ac.push(c);
        });
        attrs.className = ac.join(' ');
        delete props.className;
      }

      if ((0, _utils.isObject)(attrs.style) && (0, _utils.isObject)(props.style) && attrs.style !== props.style) {
        Object.assign(attrs.style, props.style);
        delete props.style;
      }

      return Object.assign(attrs, props);
    }
  }, {
    key: "_resolveFilter",
    value: function _resolveFilter(filter, filterName) {
      if (!this.$filters) return '';

      try {
        return filter();
      } catch (e) {
        (0, _utils.handleError)(e, this, "filter:".concat(filterName));
        return '';
      }
    }
  }, {
    key: "_resolveWillMount",
    value: function _resolveWillMount(beforeMount, mounted) {
      var _this4 = this;

      var _pending = function _pending() {
        if (!_this4._isVueLikeRoot && _this4.$parent) {
          Object.keys(_config2.default.optionMergeStrategies).forEach(function (key) {
            var ret = _config2.default.optionMergeStrategies[key](_this4.$parent[key], _this4[key], _this4, key);

            if (ret !== _this4[key]) _this4[key] = ret;
          });
        }

        _this4.$root = _this4.$parent ? _this4.$parent.$root : _this4;

        _this4._resolveInherits();

        _this4._resolveInject();

        _this4._resolveData();

        _this4._resolveComputed();

        _this4._resolveWatch();

        var pending = _this4._mountedPending;
        _this4._mountedPending = [];
        pending.forEach(function (v) {
          return v();
        });
        beforeMount && beforeMount();
        _this4._isMounted = true;
        mounted && _this4.$nextTick(mounted);
      };

      if (!this.$parent || this.$parent._isWillMount) _pending();else this.$parent._mountedPending.push(_pending);
    }
  }, {
    key: "_resolveInherits",
    value: function _resolveInherits() {
      var _this5 = this;

      if (!this._isVueLikeRoot && this.$parent) {
        if (this.$parent._inherits) {
          if (!this._inherits) this._inherits = {};
          Object.assign(this._inherits, this.$parent._inherits);
        }
      }

      if (this._inherits) {
        Object.keys(this._inherits).forEach(function (key) {
          var child = _this5[key];
          var parent = _this5._inherits[key];
          var merge = _config2.default.inheritMergeStrategies[key];
          var v = merge ? merge(parent, child, _this5, key) : parent;
          if (v !== undefined) _this5[key] = v;
        });
      }
    }
  }, {
    key: "_resolveData",
    value: function _resolveData() {
      (0, _mobx.extendObservable)(this, this._data.deeps, {}, {
        deep: true
      });
      (0, _mobx.extendObservable)(this, this._data.shadows, {}, {
        deep: false
      });
    }
  }, {
    key: "_resolveComputed",
    value: function _resolveComputed() {
      (0, _mobx.extendObservable)(this, this._computed);
    }
  }, {
    key: "_resolveWatch",
    value: function _resolveWatch() {
      bindWatch(this, this._watch);
    }
  }, {
    key: "_resolveParent",
    value: function _resolveParent() {
      var _this6 = this;

      if (!this._isVueLikeRoot) {
        (0, _utils.iterativeParent)(this, function (parent) {
          return _this6.$parent = parent;
        }, ReactVueLike);
        if (this.$parent) this.$parent.$children.push(this);
      }
    }
  }, {
    key: "_resolveInject",
    value: function _resolveInject() {
      var _this7 = this;

      if (!this.$parent) return;

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
                  _this7.$set(_this7, key, v);

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
      var _this8 = this;

      this._flushTicks();

      if (this.$parent) {
        var idx = this.$parent.$children.findIndex(function (c) {
          return c === _this8;
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
    key: "$runInAction",
    value: function $runInAction() {
      return _mobxReact.runInAction.apply(void 0, arguments);
    }
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
    key: "$computed",
    value: function $computed(target, expr, value) {
      var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var _parseExpr2 = (0, _utils.parseExpr)(target, expr),
          obj = _parseExpr2.obj,
          key = _parseExpr2.key;

      if (obj && key) {
        if (!force && obj[key]) {
          var e = new Error("key '".concat(expr, "' has aleady exist!"));
          (0, _utils.handleError)(e, this, "$computed:".concat(expr));
          throw e;
        }

        var computedObj = {};
        if ((0, _utils.isFunction)(value)) (0, _utils.defComputed)(computedObj, key, value);else (0, _utils.defComputed)(computedObj, key, value.get, value.set);
        (0, _mobx.extendObservable)(obj, computedObj);
      }
    }
  }, {
    key: "$set",
    value: function $set(target, expr, value) {
      var _parseExpr3 = (0, _utils.parseExpr)(target, expr),
          obj = _parseExpr3.obj,
          key = _parseExpr3.key;

      if (obj && key) (0, _mobx.set)(obj, key, value);
    }
  }, {
    key: "$delete",
    value: function $delete(target, expr) {
      var _parseExpr4 = (0, _utils.parseExpr)(target, expr),
          obj = _parseExpr4.obj,
          key = _parseExpr4.key;

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
      var _this9 = this;

      eventName = (0, _utils.camelize)(eventName);
      if (!this.$listeners[eventName]) this.$listeners[eventName] = [];
      this.$listeners[eventName].push(handler);
      return function () {
        return _this9.$off(eventName, handler);
      };
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

        if (handlers.length) return;
      }

      delete this.$listeners[eventName];
    }
  }, {
    key: "$once",
    value: function $once(eventName, handler) {
      var off = this.$on(eventName, function () {
        off();

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return handler.call.apply(handler, [this].concat(args));
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this._isMounted) return null;

      var node = this._renderFn && this._renderFn.apply(this, arguments); // let el = this.$el;
      // if (el) {
      //   let inheritAttrs = Array.isArray(this._type.inheritAttrs)
      //     ? this._type.inheritAttrs
      //     : config.inheritAttrs;
      //   inheritAttrs.forEach(key => {
      //     let v = this.props[key];
      //     if (!v) return;
      //     switch (key) {
      //       case 'className':
      //         el.classList.add(...(v.split(' ').filter(Boolean)));
      //         break;
      //       case 'style':
      //         if (isObject(v)) Object.assign(el.style, v);
      //         break;
      //       default: //
      //     }
      //   });
      // }
      // console.log('ReactVueLike.render', this._type.name, node);


      return node;
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
      var _this10 = this;

      this._resolveParent();

      this._isWillMount = true;

      this._resolveWillMount(function () {
        return _this10.$emit('hook:beforeMount');
      }, function () {
        return _this10.$emit('hook:mounted');
      });
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
}(_react.default.Component), _defineProperty(_class2, "isRoot", false), _defineProperty(_class2, "isAbstract", false), _defineProperty(_class2, "inheritAttrs", true), _defineProperty(_class2, "inherits", {}), _defineProperty(_class2, "props", {}), _defineProperty(_class2, "mixins", []), _defineProperty(_class2, "directives", {}), _defineProperty(_class2, "filters", {}), _defineProperty(_class2, "inject", []), _defineProperty(_class2, "computed", {}), _defineProperty(_class2, "watch", {}), _defineProperty(_class2, "methods", {}), _temp)) || _class;

ReactVueLike.config.optionMergeStrategies = _config2.default.optionMergeStrategies;
ReactVueLike.config.inheritMergeStrategies = _config2.default.inheritMergeStrategies;
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
    }

    var newComponent;

    if (Component.beforeConstructor) {
      var _Component;

      newComponent = (_Component = Component).beforeConstructor.apply(_Component, args);
    }

    return _createElement.call.apply(_createElement, [this, newComponent || Component].concat(args));
  };
}

ReactHook();
var _default = ReactVueLike;
exports.default = _default;