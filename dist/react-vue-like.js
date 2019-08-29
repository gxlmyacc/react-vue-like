module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! regenerator-runtime */ "regenerator-runtime");

/***/ }),

/***/ "./node_modules/_webpack@4.39.3@webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _mobx = __webpack_require__(/*! mobx */ "mobx");

var _mobxReact = __webpack_require__(/*! mobx-react */ "mobx-react");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

var _config2 = _interopRequireDefault(__webpack_require__(/*! ./config */ "./src/config.js"));

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
    if ((0, _utils.isFunction)(v)) return (0, _utils.defComputed)(key, v);
    (0, _utils.defComputed)(key, v.get, v.set);
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
    var mixins = target.mixins;
    _this._isVueLike = true;
    _this._type = target;
    _this._ticks = [];
    _this._provides = [];
    _this._injects = [];
    _this.$refs = {};
    _this.$parent = null;
    _this.$root = null;
    _this.$children = [];
    _this._renderFn = _this.render;
    _this.render = ReactVueLike.prototype.render;
    var ctxs = mixins ? [].concat(_toConsumableArray(mixins), [target]) : [target];
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
    (0, _mobx.extendObservable)(_assertThisInitialized(_this), _this.$data);
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

      (0, _utils.iterativeParent)(this, function (parent) {
        return _this2.$parent = parent;
      }, ReactVueLike);
      this.$root = this.$parent ? this.$parent.$root : this;
      if (this.$parent) this.$parent.$children.push(this);
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
    key: "_resolveDestory",
    value: function _resolveDestory() {
      var _this4 = this;

      if (this.$parent) {
        var idx = this.$parent.$children.findIndex(function (c) {
          return c === _this4;
        });
        if (~idx) this.$parent.$children.splice(idx, 1);
      }
    }
  }, {
    key: "_callListener",
    value: function () {
      var _callListener2 = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(eventName, handlers, args) {
        var ret, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, handler;

        return _regenerator.default.wrap(function _callee$(_context) {
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
    value: function errorCaptured(err, vm, info) {}
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
      this.$emit('hook:updated');

      if (this._ticks.length) {
        var ticks = this._ticks.slice();

        this._ticks = [];
        ticks.forEach(function (v) {
          return v();
        });
      }
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
    key: "data",
    value: function data(props) {
      return {};
    }
  }, {
    key: "provide",
    value: function provide() {}
  }]);

  return ReactVueLike;
}(_react.default.Component), _defineProperty(_class2, "props", {}), _defineProperty(_class2, "mixins", []), _defineProperty(_class2, "inject", []), _defineProperty(_class2, "computed", {}), _defineProperty(_class2, "watch", {}), _defineProperty(_class2, "methods", {}), _temp)) || _class;

ReactVueLike.Component = ReactVueLike;
var _default = ReactVueLike;
exports.default = _default;

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var config = {
  silent: false,
  errorHandler: null,
  warnHandler: null
};
var _default = config;
exports.default = _default;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  propcheck: true,
  ReactVueLikeStore: true
};
Object.defineProperty(exports, "propcheck", {
  enumerable: true,
  get: function get() {
    return _propCheck.default;
  }
});
Object.defineProperty(exports, "ReactVueLikeStore", {
  enumerable: true,
  get: function get() {
    return _store.default;
  }
});
exports.default = void 0;

var _component = _interopRequireDefault(__webpack_require__(/*! ./component */ "./src/component.js"));

var _propCheck = _interopRequireDefault(__webpack_require__(/*! ./prop-check */ "./src/prop-check.js"));

var _store = _interopRequireDefault(__webpack_require__(/*! ./store */ "./src/store.js"));

var _provider = __webpack_require__(/*! ./provider */ "./src/provider.js");

Object.keys(_provider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _provider[key];
    }
  });
});

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _component.default;
exports.default = _default;

/***/ }),

/***/ "./src/prop-check.js":
/*!***************************!*\
  !*** ./src/prop-check.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = propcheck;

var _propTypes2 = _interopRequireDefault(__webpack_require__(/*! prop-types */ "prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateProps(aPropTypes, aProps) {
  var ret = {
    propTypes: {},
    defaultProps: {}
  };
  if (!aPropTypes) return ret;

  if (Array.isArray(aPropTypes)) {
    var _propTypes = {};
    aPropTypes.forEach(function (key) {
      return _propTypes[key] = {
        type: null
      };
    });
    aPropTypes = _propTypes;
  }

  Object.keys(aPropTypes).forEach(function (key) {
    var propType = aPropTypes[key];
    if (propType.default !== undefined) ret.defaultProps[key] = propType.default;

    function getPropType(propType) {
      var typeMaps = [{
        type: String,
        value: _propTypes2.default.string
      }, {
        type: Array,
        value: _propTypes2.default.array
      }, {
        type: Object,
        value: _propTypes2.default.object
      }, {
        type: Boolean,
        value: _propTypes2.default.bool
      }, {
        type: Function,
        value: _propTypes2.default.func
      }, {
        type: String,
        value: _propTypes2.default.string
      }, {
        type: Number,
        value: _propTypes2.default.number
      }, {
        type: Symbol,
        value: _propTypes2.default.symbol
      }];

      function _getPropType(type, required) {
        var ret = _propTypes2.default.any;
        var v = typeMaps.find(function (v) {
          return v.type === type;
        });
        if (v) ret = v.value;else if (v instanceof type) _propTypes2.default.instanceOf(type);
        if (required) ret = ret.isRequired;
        return ret;
      }

      if (Object.isFunction(propType)) return _getPropType(propType);
      var type = propType.type,
          required = propType.required,
          validator = propType.validator;
      var retType;

      if (validator) {
        return function (props, propName, componentName) {
          if (!validator(props[propName])) return new Error("Invalid prop '".concat(propName, "' supplied to '").concat(componentName, "'. Validation failed."));
        };
      }

      if (!type) retType = required ? _propTypes2.default.any.isRequired : _propTypes2.default.any;
      if (Array.isArray(type)) retType = _propTypes2.default.oneOfType(type.map(function (v) {
        return _getPropType(v, required);
      }));else retType = _getPropType(type, required);
      return retType;
    } // eslint-disable-next-line


    ret.propTypes[key] = getPropType(propType);
  });
  return ret;
}

function propcheck(target) {
  var props = target.props;
  if (!props) return target; // eslint-disable-next-line

  var _generateProps = generateProps(props || {}),
      propTypes = _generateProps.propTypes,
      defaultProps = _generateProps.defaultProps;

  if (defaultProps && !target.defaultProps) target.defaultProps = defaultProps; // eslint-disable-next-line

  if (propTypes && !target.propTypes) target.propTypes = propTypes;
  return target;
}

/***/ }),

/***/ "./src/provider.js":
/*!*************************!*\
  !*** ./src/provider.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _mobxReact.Provider;
  }
});
Object.defineProperty(exports, "Observer", {
  enumerable: true,
  get: function get() {
    return _mobxReact.Observer;
  }
});

var _mobxReact = __webpack_require__(/*! mobx-react */ "mobx-react");

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mobx = __webpack_require__(/*! mobx */ "mobx");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ReactVueLikeStore =
/*#__PURE__*/
function () {
  function ReactVueLikeStore() {
    var _this = this;

    var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parent = arguments.length > 1 ? arguments[1] : undefined;
    var root = arguments.length > 2 ? arguments[2] : undefined;
    var namespace = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, ReactVueLikeStore);

    this.root = root || this;
    this.parent = parent;
    this.mutationListeners = [];
    this.namespace = namespace || '';
    this.namespaced = module.namespaced || false;
    var getters = {};
    var prefix = this.prefix;
    var state = module.state || {};
    var mutations = module.mutations || {};

    if (module.getters) {
      Object.keys(module.getters).forEach(function (key) {
        return (0, _utils.defComputed)(getters, key, function () {
          var get = module.getters[key];
          return get(_this.state, _this.getters, _this.root.state, _this.root.getters);
        });
      });
    }

    var modules = module.modules || {};
    Object.keys(mutations).forEach(function (key) {
      return mutations[key] = (0, _mobx.action)(mutations[key]);
    });
    Object.keys(modules).forEach(function (key) {
      modules[key] = new ReactVueLikeStore(modules[key], _this, _this.root, "".concat(prefix).concat(key));
    });
    this.state = _mobx.observable.object(state);
    this.getters = _mobx.observable.object(getters);
    this.mutations = mutations;
    this.modules = modules;

    if (this.root !== this) {
      var _state = {};
      Object.keys(this.state).forEach(function (key) {
        (0, _utils.defComputed)(_state, "".concat(prefix).concat(key), function () {
          return _this.state[key];
        }, function (v) {
          return _this.state[key] = v;
        });
      });
      (0, _mobx.set)(this.root.state, _state);
      var _getters = {};
      Object.keys(this.getters).forEach(function (key) {
        (0, _utils.defComputed)(_getters, "".concat(prefix).concat(key), function () {
          return _this.getters[key];
        });
      });
      (0, _mobx.set)(this.root.getters, _getters);
    }
  }

  _createClass(ReactVueLikeStore, [{
    key: "watch",
    value: function watch(fn, callback) {
      var oldValue;
      return (0, _mobx.when)(function () {
        return oldValue !== fn();
      }, callback);
    }
  }, {
    key: "commit",
    value: function commit(event, payload) {
      var _this2 = this;

      if (!event) return;
      var mutation = this.mutations[event];
      if (!mutation) return;
      var ret = mutation.call(this, this.state, payload, this.parent, this.root);
      this.mutationListeners.forEach(function (v) {
        return v({
          type: 'UPDATE_DATA',
          payload: payload
        }, _this2.state);
      });
      return ret;
    }
  }, {
    key: "subscribe",
    value: function subscribe(handler) {
      var _this3 = this;

      if (!handler || this.mutationListeners.includes(handler)) return;
      this.mutationListeners.push(handler);
      return function () {
        var idx = _this3.mutationListeners.indexOf(handler);

        if (~idx) _this3.mutationListeners.splice(idx, 1);
      };
    }
  }, {
    key: "install",
    value: function install(ReactVueLike) {
      ReactVueLike.$store = ReactVueLike.prototype.$store = this;
    }
  }, {
    key: "prefix",
    get: function get() {
      return this.namespaced ? this.namespace ? this.namespace + '/' : '' : '';
    }
  }]);

  return ReactVueLikeStore;
}();

var _default = ReactVueLikeStore;
exports.default = _default;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defComputed = defComputed;
exports.isFunction = isFunction;
exports.parseExpr = parseExpr;
exports.camelize = camelize;
exports.iterativeParent = iterativeParent;
exports.handleError = handleError;
Object.defineProperty(exports, "runInAction", {
  enumerable: true,
  get: function get() {
    return _mobx.runInAction;
  }
});

var _mobx = __webpack_require__(/*! mobx */ "mobx");

var _config = _interopRequireDefault(__webpack_require__(/*! ./config */ "./src/config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// isArray support ObservableArray
var arrayType = _mobx.observable.array([11, 22]);

if (!Array.isArray(arrayType)) {
  var _isArray = Array.isArray;

  Array.isArray = function (v) {
    return _isArray(v) || v instanceof Array;
  };
}

function defComputed(obj, key, get, set) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    get: get,
    set: set
  });
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function parseExpr(ctx, expr) {
  if (!expr) return {};
  var exps = expr.split('.');
  var parent = ctx;
  var obj;
  var key;
  exps.some(function (exp, i) {
    if (i === exps.length - 1) {
      obj = parent;
      key = exp;
      return true;
    }

    var v = parent[exp];
    if (v === undefined) return true;
    parent = v;
  });
  return {
    obj: obj,
    key: key
  };
}

function camelize(str) {
  return str.replace(/-(\w)/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
}

function iterativeParent(ctx, callback, componentClass) {
  var parentNode = ctx._reactInternalFiber && ctx._reactInternalFiber.return;

  while (parentNode) {
    var vm = parentNode.nodeType === undefined && parentNode.stateNode;

    if (vm && (!componentClass || vm instanceof componentClass)) {
      if (callback(vm)) break;
    }

    parentNode = parentNode.return;
  }
}

function warn(msg, vm) {
  var trace = vm ? generateComponentTrace(vm) : '';

  if (_config.default.warnHandler) {
    _config.default.warnHandler.call(null, msg, vm, trace);
  } else if (!_config.default.silent) {
    console.error('[Vue warn]: ' + msg + trace);
  }
}

function logError(err, vm, info) {
  if (true) {
    warn('Error in ' + info + ': "' + err.toString() + '"', vm);
  }

  if (typeof global.console !== 'undefined') {
    console.error(err);
  } // else throw err;

}

function globalHandleError(err, vm, info) {
  if (_config.default.errorHandler) {
    try {
      return _config.default.errorHandler.call(null, err, vm, info);
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }

  logError(err, vm, info);
}

function handleError(err, vm, info) {
  if (vm) {
    var cur = vm;

    do {
      var hooks = cur.$listeners['hook:errorCaptured'];

      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;

            if (capture) {
              return;
            }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    } while (cur = cur.$parent);
  }

  globalHandleError(err, vm, info);
}

var classifyRE = /(?:^|[-_])(\w)/g;

function classify(str) {
  return str.replace(classifyRE, function (c) {
    return c.toUpperCase();
  }).replace(/[-_]/g, '');
}

function formatComponentName(vm, includeFile) {
  if (vm.$root === vm) return '<Root>';
  var name = getComponentName(vm);
  return name ? '<' + classify(name) + '>' : '<Anonymous>';
}

function repeat(str, n) {
  var res = '';

  while (n) {
    if (n % 2 === 1) {
      res += str;
    }

    if (n > 1) {
      str += str;
    }

    n >>= 1;
  }

  return res;
}

function generateComponentTrace(vm) {
  if (vm._isVue && vm.$parent) {
    var tree = [];
    var currentRecursiveSequence = 0;

    while (vm) {
      if (tree.length > 0) {
        var last = tree[tree.length - 1];

        if (last.constructor === vm.constructor) {
          currentRecursiveSequence++;
          vm = vm.$parent;
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }

      tree.push(vm);
      vm = vm.$parent;
    }

    return '\n\nfound in\n\n' + tree.map(function (vm, i) {
      return '' + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + '... (' + vm[1] + ' recursive calls)' : formatComponentName(vm));
    }).join('\n');
  }

  return '\n\n(found in ' + formatComponentName(vm) + ')';
}

function getComponentName(vm) {
  var type = vm && vm._type;
  return type ? type.displayName || type.name : '<Anonymous>';
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/_webpack@4.39.3@webpack/buildin/global.js */ "./node_modules/_webpack@4.39.3@webpack/buildin/global.js")))

/***/ }),

/***/ "mobx":
/*!***********************!*\
  !*** external "mobx" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),

/***/ "mobx-react":
/*!*****************************!*\
  !*** external "mobx-react" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mobx-react");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "regenerator-runtime":
/*!**************************************!*\
  !*** external "regenerator-runtime" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ })

/******/ });
//# sourceMappingURL=react-vue-like.js.map